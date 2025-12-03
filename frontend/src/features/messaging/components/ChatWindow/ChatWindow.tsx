import { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { ConversationDto, MessageDto } from "@/features/messaging";
import {
  useSendMessage,
  useMarkMessagesAsRead,
  useMarkMessagesAsDelivered,
  useChatContext,
} from "@/features/messaging";
import { useChatHub } from "@/features/messaging/hooks/useChatHub";

interface ChatWindowProps {
  conversation: ConversationDto | null;
  messages: MessageDto[] | undefined;
  isLoadingMessages: boolean;
  currentUserId: string;
  onLoadMore?: () => void;
  hasMoreMessages?: boolean;
}

export function ChatWindow({
  conversation,
  messages,
  isLoadingMessages,
  currentUserId,
  onLoadMore,
  hasMoreMessages,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessagesAsRead();
  const markAsDeliveredMutation = useMarkMessagesAsDelivered();
  const typingTimeoutRef = useRef<number | null>(null);
  const { onlineUserIds } = useChatContext();

  // Group messages by date
  const groupedMessages = messages?.reduce(
    (groups, message) => {
      const date = new Date(message.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
      return groups;
    },
    {} as Record<string, MessageDto[]>,
  );

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMMM d, yyyy");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as delivered and read when conversation is selected
  useEffect(() => {
    if (conversation) {
      // Mark as delivered first (for sent messages)
      markAsDeliveredMutation.mutate(conversation.id);
      // Then mark as read (for unread messages)
      if (conversation.unreadCount > 0) {
        markAsReadMutation.mutate(conversation.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.id]);

  // Set up SignalR connection for real-time updates
  const { startTyping, stopTyping } = useChatHub({
    conversationId: conversation?.id,
    onMessageReceived: (_message) => {
      // Message will be added via query invalidation
    },
    onUserTyping: (userId) => {
      if (userId !== currentUserId) {
        setIsTyping(true);
        setTypingUserId(userId);
        // Clear typing indicator after 3 seconds if no stop typing event
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingUserId(null);
        }, 3000);
      }
    },
    onUserStoppedTyping: (userId) => {
      if (userId === typingUserId) {
        setIsTyping(false);
        setTypingUserId(null);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = (content: string) => {
    if (conversation) {
      sendMessageMutation.mutate({
        conversationId: conversation.id,
        request: { content },
      });
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMoreMessages && onLoadMore) {
        onLoadMore();
      }
    }
  };

  if (!conversation) {
    return (
      <section className="bg-brand-bg flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Select a conversation to start messaging
          </p>
        </div>
      </section>
    );
  }

  const otherParticipantName = `${conversation.otherParticipantFirstName} ${conversation.otherParticipantLastName}`;
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  const isOtherUserOnline = onlineUserIds.has(conversation.otherParticipantId);

  return (
    <section className="bg-brand-bg flex flex-1 flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={conversation.otherParticipantProfilePictureUrl || undefined}
              alt={otherParticipantName}
            />
            <AvatarFallback className="text-xs">
              {getInitials(
                conversation.otherParticipantFirstName,
                conversation.otherParticipantLastName,
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-tight text-slate-900">
                {otherParticipantName}
              </span>
              {isOtherUserOnline ? (
                <span className="border-brand-teal/40 bg-brand-teal/10 text-brand-secondary inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px]">
                  <span className="bg-brand-teal h-1.5 w-1.5 rounded-full"></span>
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-300/40 bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  Offline
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              {/* Additional info can be added here */}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6"
      >
        {isLoadingMessages && messages && messages.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoadingMessages &&
          groupedMessages &&
          Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              {/* Day divider */}
              <div className="mb-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-0.5 text-[11px] text-slate-500">
                  <span className="h-px w-4 bg-slate-300"></span>
                  {formatDateHeader(dateKey)}
                  <span className="h-px w-4 bg-slate-300"></span>
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message) => {
                const isOwnMessage = message.senderId === currentUserId;
                const senderName = isOwnMessage
                  ? "You"
                  : conversation.otherParticipantFirstName;

                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={isOwnMessage}
                    senderName={senderName}
                    conversationId={conversation.id}
                  />
                );
              })}
            </div>
          ))}

        {isTyping && typingUserId && (
          <div className="flex max-w-md flex-col items-start gap-1">
            <div className="mb-0.5 text-[10px] text-slate-400">
              {conversation.otherParticipantFirstName} is typing...
            </div>
            <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-sm shadow-slate-100">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: "0.2s" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        isSending={sendMessageMutation.isPending}
        onTyping={(typing) => {
          if (conversation && typing) {
            startTyping(conversation.id);
          } else if (conversation) {
            stopTyping(conversation.id);
          }
        }}
      />
    </section>
  );
}
