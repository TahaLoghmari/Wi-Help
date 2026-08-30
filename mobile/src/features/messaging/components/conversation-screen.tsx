import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "@/entities/session";
import {
  useGetMessages,
  useGetConversations,
  useMarkMessagesAsDelivered,
  useMarkMessagesAsRead,
  useSendMessage,
} from "@/entities/messaging";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { useOnlineUsers, useConversationHub } from "@/lib/signalr/use-chat-hub";
import { useDelayedScroll } from "@/features/messaging/hooks/use-delayed-scroll";
import {
  projectMessagePages,
  type ConversationListItem,
} from "@/features/messaging/lib/projection";
import { ConversationHeader } from "./conversation-header";
import { ConversationFooter } from "./conversation-footer";
import { MessageBubble } from "./message-bubble";
import { TypingBubble } from "./typing-bubble";

interface ConversationScreenProps {
  conversationId: string;
  onBack: () => void;
}

export function ConversationScreen({
  conversationId,
  onBack,
}: ConversationScreenProps) {
  const { data: user } = useCurrentUser();
  const { data: conversations } = useGetConversations();
  const conversation = conversations?.find(({ id }) => id === conversationId);
  const participantId = conversation?.otherParticipantId ?? "";
  const firstName = conversation?.otherParticipantFirstName ?? "Conversation";
  const lastName = conversation?.otherParticipantLastName ?? "";
  const profilePictureUrl =
    conversation?.otherParticipantProfilePictureUrl ?? "";
  const onlineUsers = useOnlineUsers();
  const isOnline = onlineUsers.has(participantId);
  const flatListRef = useRef<FlatList<ConversationListItem>>(null);
  const scrollToEnd = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);
  const scheduleScrollToEnd = useDelayedScroll(scrollToEnd);

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isMessagesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(conversationId);

  const sendMessageMutation = useSendMessage();
  const handleApiError = useHandleApiError();
  const markAsRead = useMarkMessagesAsRead();
  const markAsDelivered = useMarkMessagesAsDelivered();

  const { typingUserIds, startTyping, stopTyping } =
    useConversationHub(conversationId);

  const isContactTyping = typingUserIds.has(participantId);

  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const androidKeyboardStyle = useAnimatedStyle(() => ({
    paddingBottom:
      keyboard.height.value > 0 ? keyboard.height.value - insets.bottom + 8 : 0,
  }));

  const { messages: allMessages, items: listItems } = useMemo(
    () =>
      projectMessagePages({
        pages: messagesData?.pages ?? [],
        currentUserId: user?.id,
        isContactTyping,
        now: new Date(),
      }),
    [messagesData, user?.id, isContactTyping],
  );

  useEffect(() => {
    if (allMessages.length > 0) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId, allMessages.length, markAsRead]);

  useEffect(() => {
    markAsDelivered.mutate(conversationId);
  }, [conversationId, markAsDelivered]);

  const prevMessageCount = useRef(0);
  useEffect(() => {
    if (allMessages.length > prevMessageCount.current) {
      scheduleScrollToEnd();
    }
    prevMessageCount.current = allMessages.length;
  }, [allMessages.length, scheduleScrollToEnd]);

  useEffect(() => {
    if (isContactTyping) {
      scheduleScrollToEnd();
    }
  }, [isContactTyping, scheduleScrollToEnd]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessageMutation.mutate(
        { conversationId, request: { content } },
        {
          onSuccess: () => {
            scheduleScrollToEnd();
          },
          onError: handleApiError,
        },
      );
    },
    [
      conversationId,
      handleApiError,
      scheduleScrollToEnd,
      sendMessageMutation,
    ],
  );

  const handleLoadEarlier = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (e.nativeEvent.contentOffset.y < 100) {
        handleLoadEarlier();
      }
    },
    [handleLoadEarlier],
  );

  const renderItem = useCallback(
    ({ item }: { item: ConversationListItem }) => {
      if (item.type === "date") {
        return (
          <View className="items-center my-4">
            <View className="bg-brand-secondary/10 rounded-full px-3 py-1">
              <Text className="text-[10px] font-semibold text-brand-secondary/60 uppercase">
                {item.label}
              </Text>
            </View>
          </View>
        );
      }

      if (item.type === "typing") {
        return <TypingBubble firstName={firstName} lastName={lastName} />;
      }

      return (
        <MessageBubble
          message={item.message}
          isOwn={item.isOwn}
          showAvatar={item.showAvatar}
          contactFirstName={firstName}
          contactLastName={lastName}
          contactProfilePictureUrl={profilePictureUrl || null}
          isLastInGroup={item.isLastInGroup}
        />
      );
    },
    [firstName, lastName, profilePictureUrl],
  );

  const listHeader = isFetchingNextPage ? (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color="#14d3ac" />
    </View>
  ) : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <Animated.View
        className="flex-1 bg-brand-bg"
        style={Platform.OS === "android" ? androidKeyboardStyle : undefined}
      >
        {isLoadingMessages ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#14d3ac" />
          </View>
        ) : isMessagesError ? (
          <View className="flex-1 items-center justify-center px-8 gap-4">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={48}
              color="rgba(0,84,110,0.25)"
            />
            <Text className="text-brand-secondary/60 text-base font-medium text-center">
              Conversation unavailable
            </Text>
            <Text
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              className="text-brand-teal text-sm font-semibold"
            >
              Go back
            </Text>
          </View>
        ) : (
          <>
            <ConversationHeader
              firstName={firstName}
              lastName={lastName}
              profilePictureUrl={profilePictureUrl || null}
              isOnline={isOnline}
              isTyping={isContactTyping}
              onBack={onBack}
            />

            {allMessages.length === 0 && !isContactTyping ? (
              <View className="flex-1 items-center justify-center px-8">
                <Ionicons
                  name="chatbubble-outline"
                  size={48}
                  color="rgba(0,84,110,0.25)"
                />
                <Text className="text-brand-secondary/50 text-base font-medium mt-4 text-center">
                  No messages yet
                </Text>
                <Text className="text-brand-secondary/40 text-sm mt-1 text-center">
                  Send a message to start the conversation
                </Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={listItems}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                ListHeaderComponent={listHeader}
                onScroll={handleScroll}
                scrollEventThrottle={400}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() => {
                  if (
                    prevMessageCount.current === 0 &&
                    allMessages.length > 0
                  ) {
                    flatListRef.current?.scrollToEnd({ animated: false });
                  }
                }}
                maintainVisibleContentPosition={{
                  minIndexForVisible: 0,
                }}
              />
            )}

            <ConversationFooter
              onSend={handleSend}
              onTypingStart={startTyping}
              onTypingStop={stopTyping}
              isSending={sendMessageMutation.isPending}
            />
          </>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
