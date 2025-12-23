import { useState } from "react";
import { ConversationList } from "../ConversationList";
import { ChatWindow } from "../ChatWindow";
import { GetConversations, GetMessages } from "@/features/messaging";
import { useCurrentUser } from "@/features/auth";
import type {
  ConversationDto,
  MessagesResponseDto,
} from "@/features/messaging";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function MessagesLayout() {
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false);
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
        {/* Desktop Sidebar */}
        <div className="hidden h-full w-80 shrink-0 border-r border-slate-200 lg:block">
          <ConversationList
            conversations={conversations}
            isLoading={isLoadingConversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Mobile Sidebar (Sheet) */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <ConversationList
              conversations={conversations}
              isLoading={isLoadingConversations}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </SheetContent>
        </Sheet>

        <ChatWindow
          conversation={selectedConversation}
          messages={allMessages}
          isLoadingMessages={isLoadingMessages}
          currentUserId={currentUser.id}
          onLoadMore={handleLoadMore}
          hasMoreMessages={hasNextPage}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      </div>
    </section>
  );
}
