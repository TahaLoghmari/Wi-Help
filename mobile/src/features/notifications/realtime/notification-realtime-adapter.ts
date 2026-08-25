import type { QueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/entities/notification";
import type {
  RealtimeAdapter,
  RealtimeHub,
  RealtimeLifecycleSnapshot,
} from "@/lib/signalr/realtime-types";
import { HubConnectionState } from "@microsoft/signalr";
import {
  decodeNotificationReceived,
  type NotificationReceived,
} from "./notification-events";

interface NotificationToast {
  type: "info";
  text1: string;
  text2: string;
}

interface CreateNotificationRealtimeAdapterOptions {
  hub: RealtimeHub;
  queryClient: QueryClient;
  showNotification(notification: NotificationToast): void;
  onNotification(notification: NotificationReceived): void;
}

export function createNotificationRealtimeAdapter({
  hub,
  queryClient,
  showNotification,
  onNotification,
}: CreateNotificationRealtimeAdapterOptions): RealtimeAdapter {
  let snapshot: RealtimeLifecycleSnapshot = {
    connectionState: HubConnectionState.Disconnected,
    error: null,
  };
  const listeners = new Set<() => void>();

  function publish(next: RealtimeLifecycleSnapshot) {
    snapshot = next;
    for (const listener of listeners) listener();
  }

  hub.onStateChange((connectionState) => {
    publish({
      connectionState,
      error:
        connectionState === HubConnectionState.Connected
          ? null
          : snapshot.error,
    });
  });

  hub.onError((error) => {
    publish({ ...snapshot, error });
  });

  hub.on("NotificationReceived", (payload) => {
    const notification = decodeNotificationReceived(payload);
    if (!notification) return;

    queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    showNotification({
      type: "info",
      text1: notification.title,
      text2: notification.message,
    });
    onNotification(notification);
  });

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
      publish({
        connectionState: HubConnectionState.Disconnected,
        error: null,
      });
    },
  };
}
