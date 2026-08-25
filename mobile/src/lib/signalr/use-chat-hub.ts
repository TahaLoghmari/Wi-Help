import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { HubConnectionState } from "@microsoft/signalr";
import { useMessagingRealtimeAdapter } from "./realtime-context";

function useMessagingSnapshot() {
  const adapter = useMessagingRealtimeAdapter();
  return {
    adapter,
    snapshot: useSyncExternalStore(
      adapter.subscribe,
      adapter.getSnapshot,
      adapter.getSnapshot,
    ),
  };
}

export function useChatHub() {
  const { snapshot } = useMessagingSnapshot();

  return {
    connectionState: snapshot.connectionState,
    isConnected: snapshot.connectionState === HubConnectionState.Connected,
  };
}

export function useOnlineUsers(): Set<string> {
  return useMessagingSnapshot().snapshot.onlineUserIds;
}

export function useConversationHub(conversationId: string | undefined) {
  const { adapter, snapshot } = useMessagingSnapshot();
  const joinedRef = useRef<string | null>(null);
  const isHubConnected =
    snapshot.connectionState === HubConnectionState.Connected;

  useEffect(() => {
    if (!conversationId || !isHubConnected) return;

    adapter.joinConversation(conversationId);
    joinedRef.current = conversationId;

    return () => {
      if (joinedRef.current === conversationId) {
        adapter.leaveConversation(conversationId);
        joinedRef.current = null;
      }
    };
  }, [adapter, conversationId, isHubConnected]);

  useEffect(() => {
    if (!conversationId) return;
    return () => {
      adapter.stopTyping(conversationId);
      adapter.clearTypingUsers(conversationId);
    };
  }, [adapter, conversationId]);

  const startTyping = useCallback(() => {
    if (conversationId) adapter.startTyping(conversationId);
  }, [adapter, conversationId]);

  const stopTyping = useCallback(() => {
    if (conversationId) adapter.stopTyping(conversationId);
  }, [adapter, conversationId]);

  const typingUserIds = conversationId
    ? (snapshot.typingUserIds.get(conversationId) ?? new Set<string>())
    : new Set<string>();

  return { typingUserIds, startTyping, stopTyping };
}
