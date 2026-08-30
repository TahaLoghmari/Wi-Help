import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import type { AppHeaderRenderer } from "@/components/app-header";
import { useCurrentUser } from "@/entities/session";
import {
  type ConversationDto,
  useGetConversations,
} from "@/entities/messaging";
import { useOnlineUsers } from "@/lib/signalr/use-chat-hub";
import { projectConversations } from "@/features/messaging/lib/projection";
import { ChatCard } from "./chat-card";
import { ChatListSkeleton } from "./chat-list-skeleton";
import { ChatListEmpty } from "./chat-list-empty";

const keyExtractor = (item: ConversationDto) => item.id;

interface MessagesScreenProps {
  onOpenConversation: (conversationId: string) => void;
  renderHeader?: AppHeaderRenderer;
}

export function MessagesScreen({
  onOpenConversation,
  renderHeader,
}: MessagesScreenProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data: user } = useCurrentUser();

  const {
    data: conversations,
    isLoading,
    isRefetching,
    refetch,
  } = useGetConversations();

  const onlineUsers = useOnlineUsers();

  const filtered = useMemo(
    () => projectConversations(conversations ?? [], query),
    [conversations, query],
  );

  const handleConversationPress = useCallback(
    (conversation: ConversationDto) => {
      onOpenConversation(conversation.id);
    },
    [onOpenConversation],
  );

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: ConversationDto }) => (
      <ChatCard
        conversation={item}
        currentUserId={user?.id ?? ""}
        isOnline={onlineUsers.has(item.otherParticipantId)}
        isTyping={false}
        onPress={handleConversationPress}
      />
    ),
    [user?.id, onlineUsers, handleConversationPress],
  );

  const listHeader = (
    <View className="pt-4 pb-2 gap-4 px-4">
      <View className="gap-1">
        <Text className="text-2xl font-semibold tracking-tight text-brand-dark">
          {t("professional.messages.title")}
        </Text>
        <Text className="text-base text-brand-secondary/80">
          {t("professional.messages.subtitle")}
        </Text>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl border border-brand-secondary/15 bg-white px-4">
        <Ionicons name="search-outline" size={18} color="rgba(0,84,110,0.45)" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("professional.messages.searchPlaceholder")}
          placeholderTextColor="rgba(0,84,110,0.35)"
          className="flex-1 text-brand-dark text-sm py-3"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Search conversations"
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <Ionicons
              name="close-circle"
              size={18}
              color="rgba(0,84,110,0.45)"
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      {renderHeader?.(scrollY)}

      <Animated.FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? (
            <ChatListSkeleton />
          ) : (
            <ChatListEmpty hasQuery={query.length > 0} />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          filtered.length === 0 && !isLoading
            ? { flexGrow: 1, paddingBottom: 24 }
            : { paddingBottom: 24 }
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={handleRefresh}
            tintColor="#14d3ac"
            colors={["#14d3ac"]}
          />
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}
