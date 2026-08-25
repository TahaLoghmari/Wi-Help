import { HubConnectionState } from "@microsoft/signalr";
import type { QueryClient } from "@tanstack/react-query";
import { messagingKeys } from "@/entities/messaging";
import { SignalRService } from "@/lib/signalr/signalr-service";
import type {
  MessagingRealtimeAdapter,
  MessagingRealtimeSnapshot,
  RealtimeAdapterFactory,
  RealtimeHub,
} from "@/lib/signalr/realtime-types";
import {
  decodeMessagingEvent,
  type MessagingEvent,
  type MessagingHubEventName,
} from "./messaging-events";

const messagingHubEvents: MessagingHubEventName[] = [
  "OnlineUsers",
  "UserOnline",
  "UserOffline",
  "UserTyping",
  "UserStoppedTyping",
  "MessageReceived",
  "NewMessageNotification",
  "MessagesRead",
  "MessagesDelivered",
  "MessageDeleted",
];

interface CreateMessagingRealtimeAdapterOptions {
  hub: RealtimeHub;
  queryClient: QueryClient;
}

export function createMessagingRealtimeAdapter({
  hub,
  queryClient,
}: CreateMessagingRealtimeAdapterOptions): MessagingRealtimeAdapter {
  let snapshot: MessagingRealtimeSnapshot = {
    connectionState: HubConnectionState.Disconnected,
    error: null,
    onlineUserIds: new Set(),
    typingUserIds: new Map(),
  };
  const listeners = new Set<() => void>();
  const typingTimers = new Map<
    string,
    Map<string, ReturnType<typeof setTimeout>>
  >();

  function publish(next: MessagingRealtimeSnapshot) {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  function setOnlineUserIds(onlineUserIds: Set<string>) {
    publish({ ...snapshot, onlineUserIds });
  }

  function setTypingUserIds(
    conversationId: string,
    userIds: Set<string> | undefined,
  ) {
    const typingUserIds = new Map(snapshot.typingUserIds);
    if (userIds?.size) typingUserIds.set(conversationId, userIds);
    else typingUserIds.delete(conversationId);
    publish({ ...snapshot, typingUserIds });
  }

  function clearTypingTimer(conversationId: string, userId: string) {
    const conversationTimers = typingTimers.get(conversationId);
    const timer = conversationTimers?.get(userId);
    if (timer) clearTimeout(timer);
    conversationTimers?.delete(userId);
    if (!conversationTimers?.size) typingTimers.delete(conversationId);
  }

  function clearTypingUsers(conversationId: string) {
    const conversationTimers = typingTimers.get(conversationId);
    if (conversationTimers) {
      for (const timer of conversationTimers.values()) clearTimeout(timer);
      typingTimers.delete(conversationId);
    }
    if (snapshot.typingUserIds.has(conversationId)) {
      setTypingUserIds(conversationId, undefined);
    }
  }

  function applyEvent(event: MessagingEvent) {
    if (event.type === "online-users") {
      setOnlineUserIds(new Set(event.userIds));
      return;
    }

    if (event.type === "user-online" || event.type === "user-offline") {
      const onlineUserIds = new Set(snapshot.onlineUserIds);
      if (event.type === "user-online") onlineUserIds.add(event.userId);
      else onlineUserIds.delete(event.userId);
      setOnlineUserIds(onlineUserIds);
      return;
    }

    if (event.type === "user-typing") {
      const userIds = new Set(
        snapshot.typingUserIds.get(event.conversationId) ?? [],
      );
      userIds.add(event.userId);
      setTypingUserIds(event.conversationId, userIds);

      clearTypingTimer(event.conversationId, event.userId);
      const conversationTimers =
        typingTimers.get(event.conversationId) ?? new Map();
      conversationTimers.set(
        event.userId,
        setTimeout(() => {
          const currentUserIds = new Set(
            snapshot.typingUserIds.get(event.conversationId) ?? [],
          );
          currentUserIds.delete(event.userId);
          setTypingUserIds(event.conversationId, currentUserIds);
          clearTypingTimer(event.conversationId, event.userId);
        }, 5000),
      );
      typingTimers.set(event.conversationId, conversationTimers);
      return;
    }

    if (event.type === "user-stopped-typing") {
      const userIds = new Set(
        snapshot.typingUserIds.get(event.conversationId) ?? [],
      );
      userIds.delete(event.userId);
      setTypingUserIds(event.conversationId, userIds);
      clearTypingTimer(event.conversationId, event.userId);
      return;
    }

    if (event.type === "new-message-notification") {
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
      return;
    }

    queryClient.invalidateQueries({
      queryKey: messagingKeys.messages(event.conversationId),
    });
    queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
  }

  for (const eventName of messagingHubEvents) {
    hub.on(eventName, (...args) => {
      const event = decodeMessagingEvent(eventName, args);
      if (event) applyEvent(event);
    });
  }

  hub.onStateChange((connectionState) => {
    const onlineUserIds =
      connectionState === HubConnectionState.Disconnected
        ? new Set<string>()
        : snapshot.onlineUserIds;
    publish({
      ...snapshot,
      connectionState,
      error:
        connectionState === HubConnectionState.Connected
          ? null
          : snapshot.error,
      onlineUserIds,
    });
  });

  hub.onError((error) => {
    publish({ ...snapshot, error });
  });

  function invoke(method: string, conversationId: string) {
    void hub.invoke(method, conversationId).catch(() => undefined);
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start() {
      publish({ ...snapshot, error: null });
      return hub.start();
    },
    async stop() {
      await hub.stop();
      for (const conversationId of typingTimers.keys()) {
        clearTypingUsers(conversationId);
      }
      publish({
        connectionState: HubConnectionState.Disconnected,
        error: null,
        onlineUserIds: new Set(),
        typingUserIds: new Map(),
      });
    },
    joinConversation: (conversationId) => {
      invoke("JoinConversation", conversationId);
    },
    leaveConversation: (conversationId) => {
      invoke("LeaveConversation", conversationId);
    },
    startTyping: (conversationId) => {
      invoke("StartTyping", conversationId);
    },
    stopTyping: (conversationId) => {
      invoke("StopTyping", conversationId);
    },
    clearTypingUsers,
  };
}

export const messagingRealtimeAdapterFactory: RealtimeAdapterFactory<MessagingRealtimeAdapter> =
  {
    create(queryClient) {
      let hub: SignalRService;
      hub = new SignalRService({
        hubPath: "/hubs/chat",
        onReconnected: () => {
          void hub.invoke("GetOnlineUsers").catch(() => undefined);
        },
      });
      return createMessagingRealtimeAdapter({ hub, queryClient });
    },
  };
