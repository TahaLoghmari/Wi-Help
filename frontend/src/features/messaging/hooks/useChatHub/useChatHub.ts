import { HubConnectionState } from "@microsoft/signalr";
import { useEffect, useRef, useCallback } from "react";
import { queryClient } from "@/providers/react-query";
import type { MessageDto } from "@/features/messaging";
import { useChatContext } from "@/features/messaging";

interface UseChatHubOptions {
  conversationId?: string;
  onMessageReceived?: (message: MessageDto) => void;
  onUserTyping?: (userId: string) => void;
  onUserStoppedTyping?: (userId: string) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
  onMessagesRead?: (data: { conversationId: string; readBy: string }) => void;
  onMessagesDelivered?: (data: {
    conversationId: string;
    deliveredBy: string;
  }) => void;
  onMessageDeleted?: (data: {
    messageId: string;
    conversationId: string;
  }) => void;
  onNewMessageNotification?: (data: {
    conversationId: string;
    senderId: string;
    preview: string;
  }) => void;
}

export function useChatHub(options: UseChatHubOptions = {}) {
  const {
    conversationId,
    onMessageReceived,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnline,
    onUserOffline,
    onMessagesRead,
    onMessagesDelivered,
    onMessageDeleted,
    onNewMessageNotification,
  } = options;

  const callbacksRef = useRef(options);
  const { connection, connectionState, connectionError } = useChatContext();

  // Update callbacks ref without triggering re-renders
  useEffect(() => {
    callbacksRef.current = {
      conversationId,
      onMessageReceived,
      onUserTyping,
      onUserStoppedTyping,
      onUserOnline,
      onUserOffline,
      onMessagesRead,
      onMessagesDelivered,
      onMessageDeleted,
      onNewMessageNotification,
    };
  }, [
    conversationId,
    onMessageReceived,
    onUserTyping,
    onUserStoppedTyping,
    onUserOnline,
    onUserOffline,
    onMessagesRead,
    onMessagesDelivered,
    onMessageDeleted,
    onNewMessageNotification,
  ]);

  // Note: Messages are sent via HTTP API, not SignalR
  // SignalR is only used for receiving real-time updates

  const startTyping = useCallback(
    async (convId: string) => {
      if (connection?.state === HubConnectionState.Connected && convId) {
        try {
          await connection.invoke("StartTyping", convId);
        } catch (error) {
          console.error("Failed to send start typing:", error);
        }
      }
    },
    [connection],
  );

  const stopTyping = useCallback(
    async (convId: string) => {
      if (connection?.state === HubConnectionState.Connected && convId) {
        try {
          await connection.invoke("StopTyping", convId);
        } catch (error) {
          console.error("Failed to send stop typing:", error);
        }
      }
    },
    [connection],
  );

  useEffect(() => {
    if (!connection) return;

    const handleMessageReceived = (messageData: {
      messageId: string;
      conversationId: string;
      senderId: string;
      content: string;
      status: string;
      createdAt: string;
    }) => {
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

      queryClient.invalidateQueries({
        queryKey: ["messages", messageData.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleUserTyping = (convId: string, userId: string) => {
      const currentConvId = callbacksRef.current.conversationId;
      if (convId === currentConvId && callbacksRef.current.onUserTyping) {
        callbacksRef.current.onUserTyping(userId);
      }
    };

    const handleUserStoppedTyping = (convId: string, userId: string) => {
      const currentConvId = callbacksRef.current.conversationId;
      if (
        convId === currentConvId &&
        callbacksRef.current.onUserStoppedTyping
      ) {
        callbacksRef.current.onUserStoppedTyping(userId);
      }
    };

    const handleUserOnline = (userId: string) => {
      if (callbacksRef.current.onUserOnline) {
        callbacksRef.current.onUserOnline(userId);
      }
    };

    const handleUserOffline = (userId: string) => {
      if (callbacksRef.current.onUserOffline) {
        callbacksRef.current.onUserOffline(userId);
      }
    };

    const handleMessagesRead = (data: {
      conversationId: string;
      readBy: string;
    }) => {
      if (callbacksRef.current.onMessagesRead) {
        callbacksRef.current.onMessagesRead(data);
      }
      queryClient.invalidateQueries({
        queryKey: ["messages", data.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleMessagesDelivered = (data: {
      conversationId: string;
      deliveredBy: string;
    }) => {
      if (callbacksRef.current.onMessagesDelivered) {
        callbacksRef.current.onMessagesDelivered(data);
      }
      queryClient.invalidateQueries({
        queryKey: ["messages", data.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleMessageDeleted = (data: {
      messageId: string;
      conversationId: string;
    }) => {
      if (callbacksRef.current.onMessageDeleted) {
        callbacksRef.current.onMessageDeleted(data);
      }
      queryClient.invalidateQueries({
        queryKey: ["messages", data.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const handleNewMessageNotification = (data: {
      conversationId: string;
      senderId: string;
      preview: string;
    }) => {
      if (callbacksRef.current.onNewMessageNotification) {
        callbacksRef.current.onNewMessageNotification(data);
      }
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    connection.on("MessageReceived", handleMessageReceived);
    connection.on("UserTyping", handleUserTyping);
    connection.on("UserStoppedTyping", handleUserStoppedTyping);
    connection.on("UserOnline", handleUserOnline);
    connection.on("UserOffline", handleUserOffline);
    connection.on("MessagesRead", handleMessagesRead);
    connection.on("MessagesDelivered", handleMessagesDelivered);
    connection.on("MessageDeleted", handleMessageDeleted);
    connection.on("NewMessageNotification", handleNewMessageNotification);

    return () => {
      connection.off("MessageReceived", handleMessageReceived);
      connection.off("UserTyping", handleUserTyping);
      connection.off("UserStoppedTyping", handleUserStoppedTyping);
      connection.off("UserOnline", handleUserOnline);
      connection.off("UserOffline", handleUserOffline);
      connection.off("MessagesRead", handleMessagesRead);
      connection.off("MessagesDelivered", handleMessagesDelivered);
      connection.off("MessageDeleted", handleMessageDeleted);
      connection.off("NewMessageNotification", handleNewMessageNotification);
    };
  }, [connection]);

  // Track joined conversation to handle reconnection
  const joinedConversationRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !connection ||
      !conversationId ||
      connectionState !== HubConnectionState.Connected
    ) {
      return;
    }

    const activeConnection = connection;

    // Join conversation
    activeConnection
      .invoke("JoinConversation", conversationId)
      .then(() => {
        joinedConversationRef.current = conversationId;
      })
      .catch((err) => {
        console.error("Failed to join conversation:", err);
      });

    return () => {
      // Only leave if we successfully joined
      if (joinedConversationRef.current === conversationId) {
        activeConnection
          .invoke("LeaveConversation", conversationId)
          .catch((err) => {
            // Only log if connection is still active
            if (activeConnection.state === HubConnectionState.Connected) {
              console.error("Failed to leave conversation:", err);
            }
          });
        joinedConversationRef.current = null;
      }
    };
  }, [connection, conversationId, connectionState]);

  // Re-join conversation after reconnection
  useEffect(() => {
    if (
      connection &&
      connectionState === HubConnectionState.Connected &&
      conversationId &&
      joinedConversationRef.current !== conversationId
    ) {
      connection
        .invoke("JoinConversation", conversationId)
        .then(() => {
          joinedConversationRef.current = conversationId;
        })
        .catch((err) => {
          console.error("Failed to re-join conversation after reconnect:", err);
        });
    }
  }, [connection, connectionState, conversationId]);

  return {
    connection,
    startTyping,
    stopTyping,
    isConnected: connectionState === HubConnectionState.Connected,
    connectionError,
    connectionState,
  };
}
