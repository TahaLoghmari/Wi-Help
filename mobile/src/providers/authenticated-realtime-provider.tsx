import type { ReactNode } from "react";
import type { QueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { appointmentKeys } from "@/features/appointments/api";
import { messagingKeys } from "@/features/messaging/api";
import { NotificationType } from "@/features/notifications/api";
import { reviewKeys } from "@/features/reviews/api";
import { messagingRealtimeAdapterFactory } from "@/features/messaging/realtime";
import {
  createNotificationRealtimeAdapter,
  type NotificationReceived,
} from "@/features/notifications";
import { SignalRService } from "@/shared/api/signalr";
import type {
  RealtimeAdapter,
  RealtimeAdapterFactory,
  RealtimeHub,
} from "@/shared/api/signalr/realtime-types";
import { SignalRProvider } from "@/providers/signalr-provider";

const appointmentNotificationTypes = new Set<string>([
  NotificationType.newAppointment,
  NotificationType.appointmentAccepted,
  NotificationType.appointmentRejected,
  NotificationType.appointmentCancelled,
  NotificationType.appointmentCompleted,
  NotificationType.appointmentStatusUpdated,
]);

function invalidateRelatedCaches(
  queryClient: QueryClient,
  notification: NotificationReceived,
) {
  if (appointmentNotificationTypes.has(notification.type)) {
    if (notification.role === "Professional") {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    } else if (notification.role === "Patient") {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.patientList });
    }
    return;
  }

  if (notification.type === NotificationType.newMessage) {
    queryClient.invalidateQueries({ queryKey: messagingKeys.conversations });
    return;
  }

  if (notification.type === NotificationType.newReview) {
    queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    queryClient.invalidateQueries({ queryKey: reviewKeys.allStats });
  }
}

export function createAuthenticatedNotificationRealtimeAdapterFactory(
  createHub: () => RealtimeHub,
): RealtimeAdapterFactory<RealtimeAdapter> {
  return {
    create(queryClient) {
      return createNotificationRealtimeAdapter({
        hub: createHub(),
        queryClient,
        showNotification: (notification) => Toast.show(notification),
        onNotification: (notification) =>
          invalidateRelatedCaches(queryClient, notification),
      });
    },
  };
}

export const authenticatedNotificationRealtimeAdapterFactory =
  createAuthenticatedNotificationRealtimeAdapterFactory(
    () => new SignalRService({ hubPath: "/hubs/notifications" }),
  );

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
