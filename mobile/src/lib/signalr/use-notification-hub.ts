import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { SignalRService } from "./signalr-service";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { notificationKeys } from "@/api/notifications/keys";
import { appointmentKeys } from "@/api/appointments/keys";
import { messagingKeys } from "@/api/messaging/keys";

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: string;
  role: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationHub = new SignalRService({
  hubPath: "/hubs/notifications",
});
export function useNotificationHub() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const connectedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!currentUser) {
      if (connectedForUser.current) {
        notificationHub.stop();
        connectedForUser.current = null;
      }
      return;
    }

    if (connectedForUser.current === currentUser.id) return;

    connectedForUser.current = currentUser.id;
    notificationHub.start();

    const off = notificationHub.on(
      "NotificationReceived",
      (notification: unknown) => {
        const n = notification as NotificationPayload;
        queryClient.invalidateQueries({ queryKey: notificationKeys.all });

        Toast.show({
          type: "info",
          text1: n.title,
          text2: n.message,
        });

        if (n.role === "Professional") {
          queryClient.invalidateQueries({
            queryKey: appointmentKeys.all,
          });
          queryClient.invalidateQueries({
            queryKey: messagingKeys.conversations,
          });
        } else if (n.role === "Patient") {
          queryClient.invalidateQueries({
            queryKey: ["patient-appointments"],
          });
          queryClient.invalidateQueries({
            queryKey: messagingKeys.conversations,
          });
        }
      },
    );

    return () => {
      off();
      notificationHub.stop();
      connectedForUser.current = null;
    };
  }, [currentUser?.id, isLoading, queryClient]);
}
