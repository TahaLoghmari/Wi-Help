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
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useGetMessages } from "@/api/messaging/get-messages";
import { useSendMessage } from "@/api/messaging/send-message";
import { useMarkMessagesAsRead } from "@/api/messaging/mark-messages-as-read";
import { useMarkMessagesAsDelivered } from "@/api/messaging/mark-messages-as-delivered";
import { useOnlineUsers, useConversationHub } from "@/lib/signalr/use-chat-hub";
import { type MessageDto } from "@/features/messaging/types/messaging.types";
import { getDateLabel, isSameDay } from "@/features/messaging/lib/utils";
import { ConversationHeader } from "./conversation-header";
import { ConversationFooter } from "./conversation-footer";
import { MessageBubble } from "./message-bubble";
import { TypingBubble } from "./typing-bubble";

interface ConversationScreenProps {
  conversationId: string;
  participantId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  backRoute?: string;
}

type ListItem =
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

export function ConversationScreen({
  conversationId,
  participantId,
  firstName,
  lastName,
  profilePictureUrl,
  backRoute,
}: ConversationScreenProps) {
  const { data: user } = useCurrentUser();
  const onlineUsers = useOnlineUsers();
  const isOnline = onlineUsers.has(participantId);
  const flatListRef = useRef<FlatList<ListItem>>(null);

  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(conversationId);

  const sendMessageMutation = useSendMessage();
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

  const allMessages = useMemo(() => {
    if (!messagesData) return [];
    const pages = [...messagesData.pages].reverse();
    const msgs: MessageDto[] = [];
    for (const page of pages) {
      msgs.push(...page.messages);
    }
    return msgs;
  }, [messagesData]);

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];

    for (let i = 0; i < allMessages.length; i++) {
      const msg = allMessages[i];
      const prevMsg = i > 0 ? allMessages[i - 1] : null;

      if (!prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt)) {
        items.push({
          type: "date",
          key: `date-${msg.createdAt}`,
          label: getDateLabel(msg.createdAt),
        });
      }

      const isOwn = msg.senderId === user?.id;
      const nextMsg = i < allMessages.length - 1 ? allMessages[i + 1] : null;
      const isFirstInGroup =
        !prevMsg ||
        prevMsg.senderId !== msg.senderId ||
        !isSameDay(prevMsg.createdAt, msg.createdAt);
      const isLastInGroup =
        !nextMsg ||
        nextMsg.senderId !== msg.senderId ||
        !isSameDay(msg.createdAt, nextMsg.createdAt);
      const showAvatar = !isOwn && isFirstInGroup;

      items.push({
        type: "message",
        key: msg.id,
        message: msg,
        isOwn,
        showAvatar,
        isLastInGroup,
      });
    }

    if (isContactTyping) {
      items.push({ type: "typing", key: "typing-indicator" });
    }

    return items;
  }, [allMessages, user?.id, isContactTyping]);

  useEffect(() => {
    if (conversationId && allMessages.length > 0) {
      markAsRead.mutate(conversationId);
    }
  }, [conversationId, allMessages.length, markAsRead]);

  useEffect(() => {
    if (conversationId) {
      markAsDelivered.mutate(conversationId);
    }
  }, [conversationId, markAsDelivered]);

  const prevMessageCount = useRef(0);
  useEffect(() => {
    if (allMessages.length > prevMessageCount.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
    prevMessageCount.current = allMessages.length;
  }, [allMessages.length]);

  useEffect(() => {
    if (isContactTyping) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isContactTyping]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessageMutation.mutate(
        { conversationId, request: { content } },
        {
          onSuccess: () => {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          },
        },
      );
    },
    [conversationId, sendMessageMutation],
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
    ({ item }: { item: ListItem }) => {
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
        <ConversationHeader
          firstName={firstName}
          lastName={lastName}
          profilePictureUrl={profilePictureUrl || null}
          isOnline={isOnline}
          isTyping={isContactTyping}
          backRoute={backRoute}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#14d3ac" />
          </View>
        ) : allMessages.length === 0 && !isContactTyping ? (
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
              if (prevMessageCount.current === 0 && allMessages.length > 0) {
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
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
