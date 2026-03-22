import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";
import {
  useNotifications,
  type NotificationFilter,
} from "@/features/notifications/hooks/useNotifications";
import {
  NotificationType,
  type NotificationDto,
} from "@/features/notifications/types/api.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayKey(dateString: string): string {
  return dateString.slice(0, 10); // YYYY-MM-DD
}

function getDayLabel(dayKey: string): string {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (dayKey === todayKey) return "Today";
  if (dayKey === yesterdayKey) return "Yesterday";

  const date = new Date(dayKey);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

type NotificationIconConfig = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  bgClass: string;
  color: string;
};

const ICON_MAP: Record<string, NotificationIconConfig> = {
  [NotificationType.newAppointment]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentAccepted]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentRejected]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentCancelled]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentCompleted]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentStatusUpdated]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.newMessage]: {
    name: "chatbubble-outline",
    bgClass: "bg-brand-blue/10",
    color: "#3fa6ff",
  },
  [NotificationType.newReview]: {
    name: "star-outline",
    bgClass: "bg-brand-cream/30",
    color: "#00394a",
  },
};

const FALLBACK_ICON: NotificationIconConfig = {
  name: "notifications-outline",
  bgClass: "bg-brand-secondary/10",
  color: "#00546e",
};

function getIconConfig(type: string): NotificationIconConfig {
  return ICON_MAP[type] ?? FALLBACK_ICON;
}

// ─── List item types ──────────────────────────────────────────────────────────

type SectionHeaderItem = { _kind: "header"; key: string; label: string };
type NotificationItem = {
  _kind: "notification";
  key: string;
  notification: NotificationDto;
};
type ListItem = SectionHeaderItem | NotificationItem;

function buildListItems(notifications: NotificationDto[]): ListItem[] {
  if (notifications.length === 0) return [];

  // Group by day key, preserving order
  const grouped = new Map<string, NotificationDto[]>();
  for (const n of notifications) {
    const key = getDayKey(n.createdAt);
    const group = grouped.get(key);
    if (group) {
      group.push(n);
    } else {
      grouped.set(key, [n]);
    }
  }

  const items: ListItem[] = [];
  for (const [dayKey, group] of grouped) {
    items.push({
      _kind: "header",
      key: `header-${dayKey}`,
      label: getDayLabel(dayKey),
    });
    for (const n of group) {
      items.push({ _kind: "notification", key: n.id, notification: n });
    }
  }
  return items;
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTERS: { key: NotificationFilter; labelKey: string }[] = [
  { key: "all", labelKey: "professional.notifications.filters.all" },
  {
    key: "appointments",
    labelKey: "professional.notifications.filters.appointments",
  },
  {
    key: "messages",
    labelKey: "professional.notifications.filters.messages",
  },
  { key: "reviews", labelKey: "professional.notifications.filters.reviews" },
];

function FilterTabs({
  active,
  onChange,
}: {
  active: NotificationFilter;
  onChange: (f: NotificationFilter) => void;
}) {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {FILTERS.map(({ key, labelKey }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={clsx(
              "px-5 py-2 rounded-full",
              isActive
                ? "bg-brand-dark shadow-sm"
                : "bg-transparent border border-brand-secondary/15 shadow-transparent",
            )}
            accessibilityLabel={`Filter ${t(labelKey)}`}
            accessibilityRole="tab"
          >
            <Text
              className={clsx(
                "text-sm font-medium",
                isActive ? "text-white" : "text-brand-secondary",
              )}
            >
              {t(labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Notification card ────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: NotificationDto;
  onPress: (id: string) => void;
}

const NotificationCard = React.memo(function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  const icon = getIconConfig(notification.type);

  return (
    <Pressable
      onPress={() => {
        if (!notification.isRead) onPress(notification.id);
      }}
      style={[
        styles.card,
        notification.isRead ? styles.cardRead : styles.cardUnread,
      ]}
      className="mx-4 mb-3 bg-white rounded-2xl p-4"
      accessibilityLabel={notification.title}
      accessibilityRole="button"
    >
      <View className="flex-row items-start gap-3">
        {/* Icon badge */}
        <View
          className={clsx(
            "w-[42px] h-[42px] rounded-full items-center justify-center shrink-0",
            icon.bgClass,
          )}
        >
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text
            className="text-sm font-semibold text-brand-dark"
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            className="text-xs text-brand-secondary/70 mt-0.5"
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text className="text-[10px] text-brand-secondary/50 mt-1.5">
            {getRelativeTime(notification.createdAt)}
          </Text>
        </View>

        {/* Unread dot */}
        {!notification.isRead && (
          <View className="w-2 h-2 rounded-full bg-brand-teal mt-1 shrink-0" />
        )}
      </View>
    </Pressable>
  );
});

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: NotificationFilter }) {
  const { t } = useTranslation();
  const subtitleKey =
    filter === "all"
      ? "professional.notifications.empty.subtitleAll"
      : filter === "appointments"
        ? "professional.notifications.empty.subtitleAppointments"
        : filter === "messages"
          ? "professional.notifications.empty.subtitleMessages"
          : "professional.notifications.empty.subtitleReviews";

  return (
    <View className="flex-1 items-center justify-center pt-16 px-6">
      <Ionicons
        name="notifications-off-outline"
        size={48}
        color="rgba(0,84,110,0.25)"
      />
      <Text className="text-base font-semibold text-brand-dark mt-4">
        {t("professional.notifications.empty.title")}
      </Text>
      <Text className="text-sm text-brand-secondary/60 mt-1 text-center">
        {t(subtitleKey)}
      </Text>
    </View>
  );
}

// ─── Skeleton loading ─────────────────────────────────────────────────────────

const SKELETON_WIDTHS = [
  { title: "55%", msg1: "90%", msg2: "75%" },
  { title: "70%", msg1: "85%", msg2: "60%" },
  { title: "60%", msg1: "95%", msg2: "80%" },
  { title: "65%", msg1: "80%", msg2: "70%" },
  { title: "50%", msg1: "90%", msg2: "65%" },
  { title: "75%", msg1: "88%", msg2: "72%" },
] as const;

function SkeletonList() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 750 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle} className="pt-2">
      {SKELETON_WIDTHS.map((widths, i) => (
        <View
          key={i}
          style={styles.card}
          className="mx-4 mb-3 bg-white rounded-2xl p-4"
        >
          <View className="flex-row items-start gap-3">
            <View className="w-[42px] h-[42px] rounded-full bg-brand-secondary/10 shrink-0" />
            <View className="flex-1 gap-2">
              <View
                className="h-3.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.title }}
              />
              <View
                className="h-2.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.msg1 }}
              />
              <View
                className="h-2.5 rounded-full bg-brand-secondary/10"
                style={{ width: widths.msg2 }}
              />
              <View
                className="h-2 rounded-full bg-brand-secondary/10 mt-1"
                style={{ width: "25%" }}
              />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

const keyExtractor = (item: ListItem) => item.key;

export function NotificationsScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const {
    filteredNotifications,
    hasUnread,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
    markAsRead,
    markAllAsRead,
  } = useNotifications(filter);

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
            onPress={markAllAsRead}
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
      <FilterTabs active={filter} onChange={handleFilterChange} />
    </View>
  );

  const listFooter = isFetchingNextPage ? (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color="#14d3ac" />
    </View>
  ) : null;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ProfessionalAppHeader scrollY={scrollY} />

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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    shadowColor: "#00220e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  cardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: "#14d3ac",
  },
  cardRead: {
    borderLeftWidth: 0,
    borderLeftColor: "transparent",
  },
});
