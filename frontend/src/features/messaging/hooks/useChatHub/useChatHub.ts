import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { useEffect, useRef, useCallback } from "react";
import { queryClient } from "@/providers/react-query";
import { env } from "@/config/env";
import type { MessageDto } from "@/features/messaging";

interface UseChatHubOptions {
  conversationId?: string;
  onMessageReceived?: (message: MessageDto) => void;
  onUserTyping?: (userId: string) => void;
  onUserStoppedTyping?: (userId: string) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

// Global connection to avoid multiple instances
let globalConnection: HubConnection | null = null;
let connectionUsers = 0;

export function useChatHub(options: UseChatHubOptions = {}) {
  const {
    conversationId,
    onMessageReceived,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnline,
    onUserOffline,
  } = options;

  const connectionRef = useRef<HubConnection | null>(null);
  const callbacksRef = useRef(options);

  // Update callbacks ref without triggering re-renders
  useEffect(() => {
    callbacksRef.current = {
      conversationId,
      onMessageReceived,
      onUserTyping,
      onUserStoppedTyping,
      onUserOnline,
      onUserOffline,
    };
  }, [
    conversationId,
    onMessageReceived,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnline,
    onUserOffline,
  ]);

  // Note: Messages are sent via HTTP API, not SignalR
  // This function is kept for potential future use
  const sendMessage = useCallback(
    async (_conversationId: string, _message: MessageDto) => {
      // Messages are sent via HTTP API endpoint
      // SignalR is only used for receiving real-time updates
    },
    [],
  );

  const startTyping = useCallback(async (conversationId: string) => {
    if (
      connectionRef.current?.state === HubConnectionState.Connected &&
      conversationId
    ) {
      await connectionRef.current.invoke("StartTyping", conversationId);
    }
  }, []);

  const stopTyping = useCallback(async (conversationId: string) => {
    if (
      connectionRef.current?.state === HubConnectionState.Connected &&
      conversationId
    ) {
      await connectionRef.current.invoke("StopTyping", conversationId);
    }
  }, []);

  useEffect(() => {
    const startConnection = async () => {
      // Use global connection if it exists and is connected/connecting
      if (globalConnection) {
        const state = globalConnection.state;
        if (
          state === HubConnectionState.Connected ||
          state === HubConnectionState.Connecting ||
          state === HubConnectionState.Reconnecting
        ) {
          connectionRef.current = globalConnection;
          connectionUsers++;
          // Join conversation if we have one and connection is ready
          if (conversationId && state === HubConnectionState.Connected) {
            await globalConnection
              .invoke("JoinConversation", conversationId)
              .catch(console.error);
          }
          return;
        } else {
          // Connection exists but is disconnected, clean it up
          globalConnection = null;
          connectionUsers = 0;
        }
      }

      // Create new connection only if global doesn't exist
      if (!globalConnection) {
        const connection = new HubConnectionBuilder()
          .withUrl(`${env.apiUrl}/hubs/chat`, {
            withCredentials: true,
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              if (retryContext.previousRetryCount === 0) return 0;
              if (retryContext.previousRetryCount === 1) return 2000;
              if (retryContext.previousRetryCount === 2) return 10000;
              return 30000;
            },
          })
          .build();

        globalConnection = connection;
        connectionUsers = 1;
        connectionRef.current = connection;

        // Handle connection events
        connection.onreconnecting((error) => {
          console.warn("ChatHub reconnecting...", error);
        });

        connection.onreconnected((connectionId) => {
          console.log("ChatHub reconnected. ConnectionId:", connectionId);
          // Rejoin conversation if we have one
          if (conversationId) {
            connection.invoke("JoinConversation", conversationId);
          }
        });

        connection.onclose((error) => {
          console.error("ChatHub connection closed", error);
        });

        // Handle real-time events - use refs to access latest callbacks
        connection.on(
          "MessageReceived",
          (messageData: {
            messageId: string;
            conversationId: string;
            senderId: string;
            content: string;
            status: string;
            createdAt: string;
          }) => {
            // Map backend format to frontend MessageDto format
            const message: MessageDto = {
              id: messageData.messageId,
              senderId: messageData.senderId,
              content: messageData.content,
              status: messageData.status,
              createdAt: messageData.createdAt,
              deliveredAt: null,
              readAt: null,
            };

            if (callbacksRef.current.onMessageReceived) {
              callbacksRef.current.onMessageReceived(message);
            }
            // Invalidate messages query for the conversation
            queryClient.invalidateQueries({
              queryKey: ["messages", messageData.conversationId],
            });
            queryClient.invalidateQueries({
              queryKey: ["conversations"],
            });
          },
        );

        connection.on("UserTyping", (convId: string, userId: string) => {
          // Check if this is for our conversation
          const currentConvId = callbacksRef.current.conversationId;
          if (convId === currentConvId && callbacksRef.current.onUserTyping) {
            callbacksRef.current.onUserTyping(userId);
          }
        });

        connection.on("UserStoppedTyping", (convId: string, userId: string) => {
          const currentConvId = callbacksRef.current.conversationId;
          if (
            convId === currentConvId &&
            callbacksRef.current.onUserStoppedTyping
          ) {
            callbacksRef.current.onUserStoppedTyping(userId);
          }
        });

        connection.on("UserOnline", (userId: string) => {
          if (callbacksRef.current.onUserOnline) {
            callbacksRef.current.onUserOnline(userId);
          }
        });

        connection.on("UserOffline", (userId: string) => {
          if (callbacksRef.current.onUserOffline) {
            callbacksRef.current.onUserOffline(userId);
          }
        });

        try {
          await connection.start();
          console.log(
            "ChatHub connected successfully. ConnectionId:",
            connection.connectionId,
          );

          // Join conversation if we have one
          if (conversationId) {
            await connection
              .invoke("JoinConversation", conversationId)
              .catch(console.error);
          }
        } catch (err) {
          console.error("ChatHub connection failed:", err);
          // Clean up on failure
          globalConnection = null;
          connectionUsers = 0;
        }
      }
    };

    startConnection();

    return () => {
      connectionUsers--;

      // Leave conversation
      if (conversationId && globalConnection) {
        globalConnection
          .invoke("LeaveConversation", conversationId)
          .catch(console.error);
      }

      // Only stop connection if no other users
      if (connectionUsers <= 0 && globalConnection) {
        globalConnection
          .stop()
          .then(() => {
            console.log("ChatHub connection stopped");
            globalConnection = null;
            connectionUsers = 0;
          })
          .catch((err) => {
            console.error("Error stopping ChatHub connection:", err);
            globalConnection = null;
            connectionUsers = 0;
          });
      }

      connectionRef.current = null;
    };
  }, [conversationId]);

  // Join/leave conversation when it changes (only if connection exists)
  useEffect(() => {
    if (!globalConnection || !conversationId) return;

    if (globalConnection.state === HubConnectionState.Connected) {
      globalConnection
        .invoke("JoinConversation", conversationId)
        .catch(console.error);
      return () => {
        if (globalConnection) {
          globalConnection
            .invoke("LeaveConversation", conversationId)
            .catch(console.error);
        }
      };
    }
  }, [conversationId]);

  return {
    connection: connectionRef.current,
    sendMessage,
    startTyping,
    stopTyping,
    isConnected: connectionRef.current?.state === HubConnectionState.Connected,
  };
}
