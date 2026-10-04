import type {
  RealtimeAdapter,
  RealtimeLifecycleSnapshot,
} from "@/shared/api/signalr/realtime-types";

export interface MessagingRealtimeSnapshot extends RealtimeLifecycleSnapshot {
  onlineUserIds: Set<string>;
  typingUserIds: Map<string, Set<string>>;
}

export interface MessagingRealtimeAdapter extends RealtimeAdapter {
  getSnapshot(): MessagingRealtimeSnapshot;
  subscribe(listener: () => void): () => void;
  joinConversation(conversationId: string): void;
  leaveConversation(conversationId: string): void;
  startTyping(conversationId: string): void;
  stopTyping(conversationId: string): void;
  clearTypingUsers(conversationId: string): void;
}
