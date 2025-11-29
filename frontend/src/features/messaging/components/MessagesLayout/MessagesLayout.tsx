import { useState } from "react";
import { ConversationList } from "../ConversationList";
import { ChatWindow } from "../ChatWindow";
import { GetConversations, GetMessages } from "@/features/messaging";
import { useCurrentUser } from "@/features/auth";
import type {
  ConversationDto,
  MessagesResponseDto,
} from "@/features/messaging";

export function MessagesLayout() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: conversations, isLoading: isLoadingConversations } =
    GetConversations();
  const { data: currentUser } = useCurrentUser();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
  } = GetMessages({
    conversationId: selectedConversation?.id || "",
    pageNumber: 1,
    pageSize: 50,
  });

  const allMessages =
    messagesData?.pages.flatMap((page: MessagesResponseDto) => page.messages) ||
    [];

  const handleSelectConversation = (conversation: ConversationDto) => {
    setSelectedConversation(conversation);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isLoadingMessages) {
      fetchNextPage();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <section
      id="page-messages"
      className="flex-1 overflow-hidden px-0 py-0 sm:px-0 lg:px-0"
    >
      <div className="flex h-[calc(100vh-4rem)]">
        <ConversationList
          conversations={conversations}
          isLoading={isLoadingConversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ChatWindow
          conversation={selectedConversation}
          messages={allMessages}
          isLoadingMessages={isLoadingMessages}
          currentUserId={currentUser.id}
          onLoadMore={handleLoadMore}
          hasMoreMessages={hasNextPage}
        />
      </div>
    </section>
  );
}
