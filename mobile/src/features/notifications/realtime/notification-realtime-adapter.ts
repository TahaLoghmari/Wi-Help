import type { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { appointmentKeys } from "@/entities/appointment";
import { messagingKeys } from "@/entities/messaging";
import { notificationKeys } from "@/entities/notification";
import { reviewKeys } from "@/entities/review";
import { SignalRService } from "@/lib/signalr/signalr-service";
import type {
  RealtimeAdapter,
  RealtimeAdapterFactory,
  RealtimeHub,
  RealtimeLifecycleSnapshot,
} from "@/lib/signalr/realtime-types";
import { HubConnectionState } from "@microsoft/signalr";
import { decodeNotificationReceived } from "./notification-events";

interface NotificationToast {
  type: "info";
  text1: string;
  text2: string;
}

interface CreateNotificationRealtimeAdapterOptions {
  hub: RealtimeHub;
  queryClient: QueryClient;
  showNotification(notification: NotificationToast): void;
}

export function createNotificationRealtimeAdapter({
  hub,
  queryClient,
  showNotification,
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

    if (notification.role === "Professional") {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.allStats });
    } else if (notification.role === "Patient") {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.patientList });
      queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      queryClient.invalidateQueries({ queryKey: reviewKeys.allStats });
    }
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

export const notificationRealtimeAdapterFactory: RealtimeAdapterFactory<RealtimeAdapter> =
  {
    create(queryClient) {
      return createNotificationRealtimeAdapter({
        hub: new SignalRService({ hubPath: "/hubs/notifications" }),
        queryClient,
        showNotification: (notification) => Toast.show(notification),
      });
    },
  };
