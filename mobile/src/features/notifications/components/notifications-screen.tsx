import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/app-header";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useNotifications } from "@/api/notifications/get-notifications";
import { useMarkNotificationAsRead } from "@/api/notifications/mark-notification-as-read";
import { useMarkAllNotificationsAsRead } from "@/api/notifications/mark-all-notifications-as-read";
import { type NotificationFilter } from "@/features/notifications/types/notifications.types";
import {
  buildListItems,
  filterNotifications,
  keyExtractor,
  NOTIFICATION_FILTERS,
  type ListItem,
} from "../lib/utils";
import { FilterTabs } from "@/components/filter-tabs";
import { NotificationCard } from "./notification-card";
import { EmptyState } from "./empty-state";
import { SkeletonList } from "./skeleton-list";

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function NotificationsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const { data: user } = useCurrentUser();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useNotifications();

  const allNotifications = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const hasUnread = useMemo(
    () => allNotifications.some((n) => !n.isRead),
    [allNotifications],
  );

  const filteredNotifications = useMemo(
    () => filterNotifications(allNotifications, filter),
    [allNotifications, filter],
  );

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

  const listItems = useMemo(
    () => buildListItems(filteredNotifications),
    [filteredNotifications],
  );

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const handleFilterChange = useCallback((f: NotificationFilter) => {
    setFilter(f);
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item._kind === "header") {
        return (
          <Text
            key={item.key}
            className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary/60 px-4 pt-5 pb-2"
          >
            {item.label}
          </Text>
        );
      }
      return (
        <NotificationCard
          notification={item.notification}
          onPress={markAsRead}
        />
      );
    },
    [markAsRead],
  );

  const listHeader = (
    <View className="pt-4 pb-3 gap-4">
      {/* Title row */}
      <View className="flex-row items-start justify-between px-4">
        <View className="flex-1 gap-1 mr-3">
          <Text className="text-2xl font-semibold tracking-tight text-brand-dark">
            {t("professional.notifications.title")}
          </Text>
          <Text className="text-base text-brand-secondary/80">
            {t("professional.notifications.subtitle")}
          </Text>
        </View>
        {hasUnread && (
          <Pressable
            onPress={() => markAllAsRead()}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            accessibilityLabel={t("professional.notifications.markAllRead")}
            accessibilityRole="button"
          >
            <Text className="text-xs font-semibold text-brand-teal">
              {t("professional.notifications.markAllRead")}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Filter tabs */}
      <FilterTabs
        tabs={NOTIFICATION_FILTERS.map(({ key, labelKey }) => ({
          key,
          label: t(labelKey),
        }))}
        active={filter}
        onChange={handleFilterChange}
      />
    </View>
  );

  const listFooter = isFetchingNextPage ? (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color="#14d3ac" />
    </View>
  ) : null;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <AppHeader scrollY={scrollY} user={user} hasUnread={hasUnread} />

      <Animated.FlatList
        data={isLoading ? [] : listItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? <SkeletonList /> : <EmptyState filter={filter} />
        }
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          listItems.length === 0 && !isLoading
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
        keyboardDismissMode="on-drag"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}
