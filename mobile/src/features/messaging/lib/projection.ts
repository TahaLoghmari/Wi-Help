import type {
  ConversationDto,
  MessageDto,
  MessagesResponseDto,
} from "@/entities/messaging";
import { getDateLabel, isSameDay } from "./utils";

export type ConversationListItem =
  | { type: "date"; key: string; label: string }
  | {
      type: "message";
      key: string;
      message: MessageDto;
      isOwn: boolean;
      showAvatar: boolean;
      isLastInGroup: boolean;
    }
  | { type: "typing"; key: string };

interface ProjectMessagePagesOptions {
  pages: readonly MessagesResponseDto[];
  currentUserId: string | undefined;
  isContactTyping: boolean;
  now: Date;
}

interface MessageProjection {
  messages: MessageDto[];
  items: ConversationListItem[];
}

export function projectMessagePages({
  pages,
  currentUserId,
  isContactTyping,
  now,
}: ProjectMessagePagesOptions): MessageProjection {
  const messages = [...pages]
    .reverse()
    .flatMap((page) => page.messages);
  const items: ConversationListItem[] = [];

  for (let index = 0; index < messages.length; index++) {
    const message = messages[index];
    const previousMessage = index > 0 ? messages[index - 1] : null;

    if (
      !previousMessage ||
      !isSameDay(previousMessage.createdAt, message.createdAt)
    ) {
      items.push({
        type: "date",
        key: `date-${message.createdAt}`,
        label: getDateLabel(message.createdAt, now),
      });
    }

    const isOwn = message.senderId === currentUserId;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const isFirstInGroup =
      !previousMessage ||
      previousMessage.senderId !== message.senderId ||
      !isSameDay(previousMessage.createdAt, message.createdAt);
    const isLastInGroup =
      !nextMessage ||
      nextMessage.senderId !== message.senderId ||
      !isSameDay(message.createdAt, nextMessage.createdAt);

    items.push({
      type: "message",
      key: message.id,
      message,
      isOwn,
      showAvatar: !isOwn && isFirstInGroup,
      isLastInGroup,
    });
  }

  if (isContactTyping) {
    items.push({ type: "typing", key: "typing-indicator" });
  }

  return { messages, items };
}

export function projectConversations(
  conversations: readonly ConversationDto[],
  query: string,
): ConversationDto[] {
  const sorted = [...conversations].sort(
    (first, second) =>
      new Date(second.lastActivityAt).getTime() -
      new Date(first.lastActivityAt).getTime(),
  );

  if (!query.trim()) return sorted;

  const normalizedQuery = query.toLowerCase();
  return sorted.filter((conversation) =>
    `${conversation.otherParticipantFirstName} ${conversation.otherParticipantLastName}`
      .toLowerCase()
      .includes(normalizedQuery),
  );
}
