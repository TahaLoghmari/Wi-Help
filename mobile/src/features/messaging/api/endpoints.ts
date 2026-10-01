export const MESSAGING_ENDPOINTS = {
  GET_CONVERSATIONS: "/messaging/conversations",
  GET_MESSAGES: (conversationId: string) =>
    `/messaging/conversations/${conversationId}/messages`,
  SEND_MESSAGE: (conversationId: string) =>
    `/messaging/conversations/${conversationId}/messages`,
  MARK_MESSAGES_AS_READ: (conversationId: string) =>
    `/messaging/conversations/${conversationId}/messages/read`,
  MARK_MESSAGES_AS_DELIVERED: (conversationId: string) =>
    `/messaging/conversations/${conversationId}/messages/delivered`,
  DELETE_MESSAGE: (messageId: string) => `/messaging/messages/${messageId}`,
} as const;
