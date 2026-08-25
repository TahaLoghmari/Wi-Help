import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { appointmentKeys } from "@/entities/appointment";
import { messagingKeys } from "@/entities/messaging";
import { reviewKeys } from "@/entities/review";
import { messagingRealtimeAdapterFactory } from "@/features/messaging";
import {
  createNotificationRealtimeAdapter,
  type NotificationReceived,
} from "@/features/notifications";
import { SignalRService } from "@/lib/signalr";
import type {
  RealtimeAdapter,
  RealtimeAdapterFactory,
} from "@/lib/signalr/realtime-types";
import { SignalRProvider } from "@/providers/signalr-provider";

function invalidateRelatedCaches(
  queryClient: QueryClient,
  notification: NotificationReceived,
) {
  if (notification.role === "Professional") {
    queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
  } else if (notification.role === "Patient") {
    queryClient.invalidateQueries({ queryKey: appointmentKeys.patientList });
  } else {
    return;
  }

  queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
  queryClient.invalidateQueries({ queryKey: reviewKeys.all });
  queryClient.invalidateQueries({ queryKey: reviewKeys.allStats });
}

export const authenticatedNotificationRealtimeAdapterFactory: RealtimeAdapterFactory<RealtimeAdapter> =
  {
    create(queryClient) {
      return createNotificationRealtimeAdapter({
        hub: new SignalRService({ hubPath: "/hubs/notifications" }),
        queryClient,
        showNotification: (notification) => Toast.show(notification),
        onNotification: (notification) =>
          invalidateRelatedCaches(queryClient, notification),
      });
    },
  };

export function AuthenticatedRealtimeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SignalRProvider
      messagingAdapterFactory={messagingRealtimeAdapterFactory}
      notificationAdapterFactory={
        authenticatedNotificationRealtimeAdapterFactory
      }
    >
      {children}
    </SignalRProvider>
  );
}
