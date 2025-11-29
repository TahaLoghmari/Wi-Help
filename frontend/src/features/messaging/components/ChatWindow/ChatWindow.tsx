import { useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import { MessageBubble } from "../MessageBubble";
import { MessageInput } from "../MessageInput";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { ConversationDto, MessageDto } from "@/features/messaging";
import { useSendMessage, useMarkMessagesAsRead } from "@/features/messaging";
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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Group messages by date
  const groupedMessages = messages?.reduce((groups, message) => {
    const date = new Date(message.createdAt);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, MessageDto[]>);

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

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markAsReadMutation.mutate(conversation.id);
    }
  }, [conversation?.id]);

  // Set up SignalR connection for real-time updates
  const { startTyping, stopTyping } = useChatHub({
    conversationId: conversation?.id,
    onMessageReceived: (message) => {
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
      <section className="flex-1 flex flex-col bg-[#fbfbfb] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500">Select a conversation to start messaging</p>
        </div>
      </section>
    );
  }

  const otherParticipantName = `${conversation.otherParticipantFirstName} ${conversation.otherParticipantLastName}`;
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <section className="flex-1 flex flex-col bg-[#fbfbfb]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white">
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
              <span className="text-xs font-medium text-slate-900 tracking-tight">
                {otherParticipantName}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#14d3ac]/10 border border-[#14d3ac]/40 text-[10px] text-[#00546e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#14d3ac]"></span>
                Online
              </span>
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
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4"
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
              <div className="flex items-center justify-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-100 text-[11px] text-slate-500">
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
                  />
                );
              })}
            </div>
          ))}

        {isTyping && typingUserId && (
          <div className="flex flex-col items-start gap-1 max-w-md">
            <div className="text-[10px] text-slate-400 mb-0.5">
              {conversation.otherParticipantFirstName} is typing...
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 shadow-sm shadow-slate-100">
              <div className="flex gap-1">
                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span
                  className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></span>
                <span
                  className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"
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

