import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { NotificationDto } from "@/features/notifications";
import { API_ENDPOINTS } from "@/config/endpoints";
import { env } from "@/config/env";
import { useCurrentUser, useLocationManager } from "@/features/auth";

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const connectionRef = useRef<HubConnection | null>(null);
  const isStoppingRef = useRef(false);

  // Location manager: checks freshness and requests geolocation when needed
  // Only runs when user is authenticated and not loading
  useLocationManager(!isUserLoading && !!currentUser, currentUser);

  useEffect(() => {
    // Wait for user loading to complete before deciding
    if (isUserLoading) {
      return;
    }

    // No authenticated user -> make sure connection is stopped
    if (!currentUser) {
      if (connectionRef.current) {
        isStoppingRef.current = true;
        connectionRef.current
          .stop()
          .then(() => {
            console.log("SignalR connection stopped (no user)");
          })
          .catch((err) => {
            console.error("Error stopping SignalR connection:", err);
          })
          .finally(() => {
            isStoppingRef.current = false;
            connectionRef.current = null;
          });
      }
      return;
    }

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
        .withUrl(`${env.apiUrl}/hubs/notifications`, {
          withCredentials: true,
          // SignalR will automatically negotiate the best transport (WebSockets, Server-Sent Events, or Long Polling)
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            // Don't retry if we're intentionally stopping
            if (isStoppingRef.current) return null;

            // Exponential backoff: 0s, 2s, 10s, 30s, then 30s intervals
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            if (retryContext.previousRetryCount < 10) return 30000;
            // Stop retrying after 10 attempts
            return null;
          },
        })
        .configureLogging(
          env.isDevelopment ? LogLevel.Information : LogLevel.Warning,
        )
        .build();

      // Configure server timeout (should be > 2x server's KeepAliveInterval)
      connection.serverTimeoutInMilliseconds = 60000;
      connection.keepAliveIntervalInMilliseconds = 15000;

      connectionRef.current = connection;

      // Handle connection events
      connection.onreconnecting((error) => {
        console.warn("SignalR reconnecting...", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected. ConnectionId:", connectionId);
      });

      connection.onclose((error) => {
        if (isStoppingRef.current) {
          console.log("SignalR connection closed (intentional)");
        } else if (error) {
          console.error("SignalR connection closed with error:", error);
        } else {
          console.log("SignalR connection closed");
        }
      });

      // Handle notifications
      connection.on("NotificationReceived", (notification: NotificationDto) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        console.log("Notification received:", notification);

        toast.info(notification.title, {
          description: notification.message,
        });

        // Invalidate relevant queries based on role
        if (notification.role === "Professional") {
          queryClient.invalidateQueries({
            queryKey: ["professional-appointments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["professional-profile"],
          });
          queryClient.invalidateQueries({
            queryKey: ["professional-reviews"],
          });
          queryClient.invalidateQueries({
            queryKey: ["professional-review-stats"],
          });
        } else if (notification.role === "Patient") {
          queryClient.invalidateQueries({
            queryKey: ["patient-appointments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["conversations"],
          });
          queryClient.invalidateQueries({
            queryKey: ["patient-reviews"],
          });
          queryClient.invalidateQueries({
            queryKey: ["patient-review-stats"],
          });
        } else if (notification.role === "Admin") {
          queryClient.invalidateQueries({
            queryKey: ["admin-appointments"],
          });
          queryClient.invalidateQueries({
            queryKey: ["admin-professionals"],
          });
        }
      });

      try {
        await connection.start();
        console.log(
          "SignalR connected successfully. ConnectionId:",
          connection.connectionId,
        );
      } catch (err: any) {
        // If we get a 401 and haven't tried refreshing yet, refresh token and retry
        if (
          err?.message?.includes("401") ||
          err?.message?.includes("Unauthorized")
        ) {
          console.log("SignalR 401 error, attempting token refresh...");
          try {
            const refreshResponse = await fetch(
              `${env.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
              {
                method: "POST",
                credentials: "include",
              },
            );
            if (refreshResponse.ok) {
              console.log("Token refreshed, retrying SignalR connection...");
              try {
                await connection.start();
                console.log(
                  "SignalR connected successfully after token refresh. ConnectionId:",
                  connection.connectionId,
                );
                return;
              } catch (retryErr) {
                console.error(
                  "SignalR connection failed after token refresh:",
                  retryErr,
                );
              }
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr);
          }
        }
        console.error("SignalR connection failed:", err);
        // Connection will automatically retry with the configured reconnection policy
      }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        isStoppingRef.current = true;
        connectionRef.current
          .stop()
          .then(() => {
            console.log("SignalR connection stopped");
          })
          .catch((err) => {
            console.error("Error stopping SignalR connection:", err);
          })
          .finally(() => {
            isStoppingRef.current = false;
          });
        connectionRef.current = null;
      }
    };
  }, [currentUser?.id, isUserLoading]);

  return <>{children}</>;
};
