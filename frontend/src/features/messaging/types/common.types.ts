export interface ConversationDto {
  id: string;
  otherParticipantId: string;
  otherParticipantFirstName: string;
  otherParticipantLastName: string;
  otherParticipantProfilePictureUrl: string | null;
  lastMessage: MessageDto | null;
  unreadCount: number;
  lastActivityAt: string;
}

export interface MessageDto {
  id: string;
  senderId: string;
  content: string;
  status: string;
  createdAt: string;
  deliveredAt: string | null;
  readAt: string | null;
}

export interface MessagesResponseDto {
  messages: MessageDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface SendMessageRequest {
  content: string;
}

export interface GetMessagesRequest {
  conversationId: string;
  pageNumber?: number;
  pageSize?: number;
}

