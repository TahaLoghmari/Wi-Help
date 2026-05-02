import { useEffect, useRef, useState, useCallback } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { SignalRService } from "./signalr-service";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { messagingKeys } from "@/api/messaging/keys";

export const chatHub = new SignalRService({
  hubPath: "/hubs/chat",
  onReconnected: () => {
    chatHub.invoke("GetOnlineUsers");
  },
});

// ─── Online presence state ────────────────────────────────────────────────────

let onlineUserIds = new Set<string>();
type OnlineUsersListener = (ids: Set<string>) => void;
const onlineUsersListeners = new Set<OnlineUsersListener>();

function setOnlineUsers(ids: Set<string>) {
  onlineUserIds = ids;
  for (const listener of onlineUsersListeners) listener(ids);
}

function addOnlineUser(id: string) {
  if (onlineUserIds.has(id)) return;
  const next = new Set(onlineUserIds);
  next.add(id);
  setOnlineUsers(next);
}

function removeOnlineUser(id: string) {
  if (!onlineUserIds.has(id)) return;
  const next = new Set(onlineUserIds);
  next.delete(id);
  setOnlineUsers(next);
}

// ─── Typing state ─────────────────────────────────────────────────────────────

type TypingListener = (
  conversationId: string,
  userId: string,
  isTyping: boolean,
) => void;
const typingListeners = new Set<TypingListener>();

// ─── Main hook: manages connection lifecycle ──────────────────────────────────

/**
 * Connects the chat hub when a user is authenticated.
 * Handles online presence events and global message events.
 * Mount this once at the app root level.
 */
export function useChatHub() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const connectedForUser = useRef<string | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Disconnected,
  );

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      if (connectedForUser.current) {
        chatHub.stop();
        connectedForUser.current = null;
        setOnlineUsers(new Set());
      }
      setConnectionState(HubConnectionState.Disconnected);
      return;
    }

    if (connectedForUser.current === currentUser.id) return;
    connectedForUser.current = currentUser.id;

    const offs: Array<() => void> = [];

    // Connection state tracking
    offs.push(
      chatHub.onStateChange((state) => {
        setConnectionState(state);
        if (state === HubConnectionState.Disconnected) {
          setOnlineUsers(new Set());
        }
      }),
    );

    // Online presence events
    offs.push(
      chatHub.on("OnlineUsers", (userIds: unknown) => {
        setOnlineUsers(new Set(userIds as string[]));
      }),
    );
    offs.push(
      chatHub.on("UserOnline", (userId: unknown) => {
        addOnlineUser(userId as string);
      }),
    );
    offs.push(
      chatHub.on("UserOffline", (userId: unknown) => {
        removeOnlineUser(userId as string);
      }),
    );

    // Typing events
    offs.push(
      chatHub.on("UserTyping", (conversationId: unknown, userId: unknown) => {
        for (const listener of typingListeners) {
          listener(conversationId as string, userId as string, true);
        }
      }),
    );
    offs.push(
      chatHub.on(
        "UserStoppedTyping",
        (conversationId: unknown, userId: unknown) => {
          for (const listener of typingListeners) {
            listener(conversationId as string, userId as string, false);
          }
        },
      ),
    );

    // Message events (global — for conversation list updates)
    offs.push(
      chatHub.on("MessageReceived", (data: unknown) => {
        const msg = data as { conversationId: string };
        queryClient.invalidateQueries({
          queryKey: messagingKeys.messages(msg.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: messagingKeys.conversations,
        });
      }),
    );

    offs.push(
      chatHub.on("NewMessageNotification", () => {
        queryClient.invalidateQueries({
          queryKey: messagingKeys.conversations,
        });
      }),
    );

    offs.push(
      chatHub.on("MessagesRead", (data: unknown) => {
        const d = data as { conversationId: string };
        queryClient.invalidateQueries({
          queryKey: messagingKeys.messages(d.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: messagingKeys.conversations,
        });
      }),
    );

    offs.push(
      chatHub.on("MessagesDelivered", (data: unknown) => {
        const d = data as { conversationId: string };
        queryClient.invalidateQueries({
          queryKey: messagingKeys.messages(d.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: messagingKeys.conversations,
        });
      }),
    );

    offs.push(
      chatHub.on("MessageDeleted", (data: unknown) => {
        const d = data as { conversationId: string };
        queryClient.invalidateQueries({
          queryKey: messagingKeys.messages(d.conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: messagingKeys.conversations,
        });
      }),
    );

    chatHub.start();

    return () => {
      for (const off of offs) off();
      chatHub.stop();
      connectedForUser.current = null;
      setOnlineUsers(new Set());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, isLoading, queryClient]);

  return {
    connectionState,
    isConnected: connectionState === HubConnectionState.Connected,
  };
}

// ─── Hooks for consumers ──────────────────────────────────────────────────────

/** Subscribe to online user IDs set */
export function useOnlineUsers(): Set<string> {
  const [ids, setIds] = useState<Set<string>>(() => onlineUserIds);

  useEffect(() => {
    const listener: OnlineUsersListener = (next) => setIds(next);
    onlineUsersListeners.add(listener);
    // Sync initial
    setIds(onlineUserIds);
    return () => {
      onlineUsersListeners.delete(listener);
    };
  }, []);

  return ids;
}

/** Join/leave a conversation group and handle typing events */
export function useConversationHub(conversationId: string | undefined) {
  const joinedRef = useRef<string | null>(null);
  const [typingUserIds, setTypingUserIds] = useState<Set<string>>(
    () => new Set(),
  );
  const typingTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const [isHubConnected, setIsHubConnected] = useState(chatHub.isConnected);
  useEffect(() => {
    setIsHubConnected(chatHub.isConnected);
    return chatHub.onStateChange((state) => {
      setIsHubConnected(state === HubConnectionState.Connected);
    });
  }, []);

  useEffect(() => {
    if (!conversationId || !isHubConnected) return;

    chatHub.invoke("JoinConversation", conversationId);
    joinedRef.current = conversationId;

    return () => {
      if (joinedRef.current === conversationId) {
        chatHub.invoke("LeaveConversation", conversationId);
        joinedRef.current = null;
      }
    };
  }, [conversationId, isHubConnected]);

  // Typing presence
  useEffect(() => {
    if (!conversationId) return;

    const listener: TypingListener = (convId, userId, isTyping) => {
      if (convId !== conversationId) return;

      if (isTyping) {
        setTypingUserIds((prev) => {
          if (prev.has(userId)) return prev;
          const next = new Set(prev);
          next.add(userId);
          return next;
        });

        // Auto-clear after 5s if no StopTyping received
        const existing = typingTimers.current.get(userId);
        if (existing) clearTimeout(existing);
        typingTimers.current.set(
          userId,
          setTimeout(() => {
            setTypingUserIds((prev) => {
              if (!prev.has(userId)) return prev;
              const next = new Set(prev);
              next.delete(userId);
              return next;
            });
            typingTimers.current.delete(userId);
          }, 5000),
        );
      } else {
        setTypingUserIds((prev) => {
          if (!prev.has(userId)) return prev;
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        const timer = typingTimers.current.get(userId);
        if (timer) {
          clearTimeout(timer);
          typingTimers.current.delete(userId);
        }
      }
    };

    typingListeners.add(listener);
    const timers = typingTimers.current;
    return () => {
      typingListeners.delete(listener);
      chatHub.invoke("StopTyping", conversationId);
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
      setTypingUserIds(new Set());
    };
  }, [conversationId]);

  const startTyping = useCallback(() => {
    if (conversationId) chatHub.invoke("StartTyping", conversationId);
  }, [conversationId]);

  const stopTyping = useCallback(() => {
    if (conversationId) chatHub.invoke("StopTyping", conversationId);
  }, [conversationId]);

  return { typingUserIds, startTyping, stopTyping };
}
