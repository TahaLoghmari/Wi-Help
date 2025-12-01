import { Search } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { Spinner } from "@/components/ui/spinner";
import type { ConversationDto } from "@/features/messaging";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useChatContext } from "@/features/messaging";

interface ConversationListProps {
  conversations: ConversationDto[] | undefined;
  isLoading: boolean;
  selectedConversationId?: string;
  onSelectConversation: (conversation: ConversationDto) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  selectedConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
}: ConversationListProps) {
  const { onlineUserIds } = useChatContext();
  const formatLastActivity = (date: string) => {
    const activityDate = new Date(date);
    if (isToday(activityDate)) {
      return format(activityDate, "HH:mm");
    }
    if (isYesterday(activityDate)) {
      return "Yesterday";
    }
    return format(activityDate, "EEE");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const filteredConversations = conversations?.filter((conv) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.otherParticipantFirstName.toLowerCase().includes(searchLower) ||
      conv.otherParticipantLastName.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  return (
    <aside className="flex w-72 flex-col border-r border-slate-200 bg-white lg:w-80">
      {/* Search */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="mb-2 text-xs font-medium tracking-tight text-slate-700">
          Messages
        </div>
        <div className="flex items-center rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-1.5 text-[11px] text-slate-500 transition-all focus-within:border-[#3fa6ff]/70 focus-within:ring-1 focus-within:ring-[#3fa6ff]/60">
          <Search
            className="mr-2 h-3.5 w-3.5 text-slate-400"
            strokeWidth={1.5}
          />
          <input
            type="text"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}

        {!isLoading &&
          (!filteredConversations || filteredConversations.length === 0) && (
            <div className="flex items-center justify-center px-4 py-10 text-center text-xs text-slate-500">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          )}

        {!isLoading &&
          filteredConversations &&
          filteredConversations.length > 0 &&
          filteredConversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;
            const otherParticipantName = `${conversation.otherParticipantFirstName} ${conversation.otherParticipantLastName}`;

            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`w-full text-left ${
                  isSelected ? "" : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`border-b border-slate-100 px-4 py-3 ${
                    isSelected ? "bg-[#00394a]/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-8 w-8">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            conversation.otherParticipantProfilePictureUrl ||
                            undefined
                          }
                          alt={otherParticipantName}
                        />
                        <AvatarFallback className="text-[10px]">
                          {getInitials(
                            conversation.otherParticipantFirstName,
                            conversation.otherParticipantLastName,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute right-0 bottom-0 h-2 w-2 rounded-full border border-white ${
                          onlineUserIds.has(conversation.otherParticipantId)
                            ? "bg-[#14d3ac]"
                            : "bg-slate-400"
                        }`}
                      ></span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium tracking-tight text-slate-900">
                          {otherParticipantName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatLastActivity(conversation.lastActivityAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[11px] text-slate-600">
                          {conversation.lastMessage
                            ? conversation.lastMessage.content
                            : "No messages yet"}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00394a] text-[10px] text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}
