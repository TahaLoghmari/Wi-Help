import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query";
import type { NotificationDto } from "@/features/notifications";

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const startConnection = async () => {
      // Don't create a new connection if one already exists and is connected/connecting
      if (
        connectionRef.current &&
        (connectionRef.current.state === HubConnectionState.Connected ||
          connectionRef.current.state === HubConnectionState.Connecting)
      ) {
        return;
      }

      const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/hubs/notifications`, {
          withCredentials: true,
          // SignalR will automatically negotiate the best transport (WebSockets, Server-Sent Events, or Long Polling)
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Exponential backoff: 0s, 2s, 10s, 30s, then 30s intervals
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .build();

      connectionRef.current = connection;

      // Handle connection events
      connection.onreconnecting((error) => {
        console.warn("SignalR reconnecting...", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected. ConnectionId:", connectionId);
      });

      connection.onclose((error) => {
        console.error("SignalR connection closed", error);
      });

      // Handle notifications
      connection.on("NotificationReceived", (notification: NotificationDto) => {
        console.log("Notification received:", notification);

        toast.info(notification.title, {
          description: notification.message,
        });

        // Invalidate relevant queries based on role
        if (notification.role === "Professional") {
          queryClient.invalidateQueries({
            queryKey: ["professional-appointments"],
          });
        } else if (notification.role === "Patient") {
          queryClient.invalidateQueries({
            queryKey: ["patient-appointments"],
          });
        }
      });

      try {
        await connection.start();
        console.log(
          "SignalR connected successfully. ConnectionId:",
          connection.connectionId,
        );
      } catch (err) {
        console.error("SignalR connection failed:", err);
        // Connection will automatically retry with the configured reconnection policy
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current
          .stop()
          .then(() => {
            console.log("SignalR connection stopped");
          })
          .catch((err) => {
            console.error("Error stopping SignalR connection:", err);
          });
        connectionRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};
