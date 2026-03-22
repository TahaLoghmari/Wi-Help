import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useGetProfessionalAppointments } from "@/features/professional/hooks/useGetProfessionalAppointments";
import { useRespondToAppointment } from "@/features/professional/hooks/useRespondToAppointment";
import { useCancelAppointmentByProfessional } from "@/features/professional/hooks/useCancelAppointmentByProfessional";
import { AppointmentCard } from "@/features/professional/components/appointments/AppointmentCard";
import {
  AppointmentStatus,
  type AppointmentDto,
} from "@/features/professional/types/api.types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

// ─── Helpers ───────────────────────────────────────────────────────────────

function getGreetingKey(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function isSameDay(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function AppHeader({
  profilePictureUrl,
  scrollY,
}: {
  profilePictureUrl?: string;
  scrollY: SharedValue<number>;
}) {
  const borderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 8], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-brand-bg">
      {/* Logo */}
      <View className="flex-row items-center gap-2">
        <Image
          source={require("@/assets/images/icon-2.png")}
          style={{ width: 32, height: 32, borderRadius: 8 }}
          contentFit="contain"
        />
        <Text className="text-xl font-semibold text-brand-dark tracking-tight">
          Wi-Help
        </Text>
      </View>

      {/* Right actions */}
      <View className="flex-row items-center gap-4">
        {/* Notification bell */}
        <Pressable
          className="relative"
          accessibilityLabel="Notifications"
          accessibilityRole="button"
        >
          <Ionicons name="notifications-outline" size={24} color="#00546e" />
          <View className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-brand-teal border border-brand-bg" />
        </Pressable>

        {/* Avatar */}
        <Pressable
          className="w-9 h-9 rounded-full border-2 border-brand-teal/20 overflow-hidden bg-brand-secondary/10 items-center justify-center"
          accessibilityLabel="Profile"
          accessibilityRole="button"
        >
          {profilePictureUrl ? (
            <Image
              source={{ uri: profilePictureUrl }}
              style={{ width: 36, height: 36 }}
              contentFit="cover"
            />
          ) : (
            <Ionicons name="person" size={18} color="#00546e" />
          )}
        </Pressable>
      </View>
      {/* Scroll-reveal separator */}
      <Animated.View
        style={[
          borderStyle,
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "rgba(0,84,110,0.08)",
          },
        ]}
      />
    </View>
  );
}

interface TodayStatCardProps {
  label: string;
  count: number;
  bgColor: string;
  iconBgColor: string;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  iconColor: string;
}

function TodayStatCard({
  label,
  count,
  bgColor,
  iconBgColor,
  iconName,
  iconColor,
}: TodayStatCardProps) {
  return (
    <View
      className="flex-1 rounded-2xl p-4"
      style={{ backgroundColor: bgColor }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary/60">
          {label}
        </Text>
        <View
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons name={iconName} size={14} color={iconColor} />
        </View>
      </View>
      <Text className="text-3xl font-semibold text-brand-dark tracking-tight">
        {count}
      </Text>
    </View>
  );
}

interface AppointmentStats {
  todayConfirmed: number;
  todayOffered: number;
  todayCompleted: number;
  todayCancelled: number;
  totalConfirmed: number;
  totalOffered: number;
  totalCompleted: number;
  totalCancelled: number;
}

function TodayStatsGrid({ stats }: { stats: AppointmentStats }) {
  const { t } = useTranslation();
  return (
    <View className="gap-3">
      <View className="flex-row gap-3">
        <TodayStatCard
          label={t("professional.dashboard.stats.confirmed")}
          count={stats.todayConfirmed}
          bgColor="rgba(20,211,172,0.10)"
          iconBgColor="rgba(20,211,172,0.18)"
          iconName="checkmark"
          iconColor="#14d3ac"
        />
        <TodayStatCard
          label={t("professional.dashboard.stats.offered")}
          count={stats.todayOffered}
          bgColor="rgba(63,166,255,0.10)"
          iconBgColor="rgba(63,166,255,0.18)"
          iconName="time-outline"
          iconColor="#3fa6ff"
        />
      </View>
      <View className="flex-row gap-3">
        <TodayStatCard
          label={t("professional.dashboard.stats.completed")}
          count={stats.todayCompleted}
          bgColor="rgba(0,233,132,0.09)"
          iconBgColor="rgba(0,233,132,0.18)"
          iconName="checkmark-circle-outline"
          iconColor="#00e984"
        />
        <TodayStatCard
          label={t("professional.dashboard.stats.cancelled")}
          count={stats.todayCancelled}
          bgColor="rgba(0,84,110,0.07)"
          iconBgColor="rgba(0,84,110,0.12)"
          iconName="close"
          iconColor="#00546e"
        />
      </View>
    </View>
  );
}

interface StatRow {
  label: string;
  count: number;
  barColor: string;
  pct: number;
}

function TotalSummaryCard({ stats }: { stats: AppointmentStats }) {
  const { t } = useTranslation();
  const total =
    stats.totalConfirmed +
    stats.totalOffered +
    stats.totalCompleted +
    stats.totalCancelled;

  const rows: StatRow[] = [
    {
      label: t("professional.dashboard.stats.confirmed"),
      count: stats.totalConfirmed,
      barColor: "#14d3ac",
      pct: total > 0 ? stats.totalConfirmed / total : 0,
    },
    {
      label: t("professional.dashboard.stats.completed"),
      count: stats.totalCompleted,
      barColor: "#00e984",
      pct: total > 0 ? stats.totalCompleted / total : 0,
    },
    {
      label: t("professional.dashboard.stats.offered"),
      count: stats.totalOffered,
      barColor: "#3fa6ff",
      pct: total > 0 ? stats.totalOffered / total : 0,
    },
    {
      label: t("professional.dashboard.stats.cancelled"),
      count: stats.totalCancelled,
      barColor: "rgba(0,84,110,0.4)",
      pct: total > 0 ? stats.totalCancelled / total : 0,
    },
  ];

  return (
    <View
      className="bg-white rounded-2xl p-4 gap-4 border border-brand-secondary/5"
      style={{
        shadowColor: "#00394a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <Text className="text-lg font-semibold text-brand-dark tracking-tight">
        {t("professional.dashboard.stats.totalAppointments")}
      </Text>
      <View className="gap-3">
        {rows.map((row) => (
          <View key={row.label} className="flex-row items-center gap-3">
            <Text className="text-xs font-medium text-brand-secondary/70 w-20 shrink-0">
              {row.label}
            </Text>
            <View
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
            >
              <View
                className="h-full rounded-full"
                style={{
                  width: `${Math.round(row.pct * 100)}%`,
                  backgroundColor: row.barColor,
                }}
              />
            </View>
            <Text className="text-sm font-semibold text-brand-dark w-6 text-right shrink-0">
              {String(row.count).padStart(2, "0")}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const FILTER_TABS: AppointmentStatus[] = [
  AppointmentStatus.Offered,
  AppointmentStatus.Confirmed,
  AppointmentStatus.Completed,
  AppointmentStatus.Cancelled,
];

function FilterTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: AppointmentStatus;
  onTabChange: (tab: AppointmentStatus) => void;
}) {
  const { t } = useTranslation();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    >
      {FILTER_TABS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className={cn(
              "px-5 py-2 rounded-full",
              isActive
                ? "bg-brand-dark shadow-sm"
                : "bg-transparent border border-brand-secondary/15 shadow-transparent",
            )}
            accessibilityLabel={`Filter by ${tab}`}
            accessibilityRole="tab"
          >
            <Text
              className={cn(
                "text-base font-medium whitespace-nowrap",
                isActive ? "text-white" : "text-brand-secondary",
              )}
            >
              {t(`professional.dashboard.stats.${tab.toLowerCase()}`)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function EmptyState({ status }: { status: AppointmentStatus }) {
  const { t } = useTranslation();
  return (
    <View className="items-center py-12 gap-3">
      <Ionicons name="calendar-outline" size={48} color="rgba(0,84,110,0.2)" />
      <Text className="text-brand-secondary/50 text-base font-medium">
        {t("professional.dashboard.appointments.noAppointments", {
          status: t(`professional.dashboard.stats.${status.toLowerCase()}`),
        })}
      </Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

const keyExtractor = (item: AppointmentDto) => item.id;

export function AppointmentsScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>(
    AppointmentStatus.Offered,
  );

  const { data: user } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetProfessionalAppointments();

  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();

  const allAppointments = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const stats = useMemo<AppointmentStats>(() => {
    const todayItems = allAppointments.filter((a) => isSameDay(a.startDate));
    return {
      todayConfirmed: todayItems.filter(
        (a) => a.status === AppointmentStatus.Confirmed,
      ).length,
      todayOffered: todayItems.filter(
        (a) => a.status === AppointmentStatus.Offered,
      ).length,
      todayCompleted: todayItems.filter(
        (a) => a.status === AppointmentStatus.Completed,
      ).length,
      todayCancelled: todayItems.filter(
        (a) => a.status === AppointmentStatus.Cancelled,
      ).length,
      totalConfirmed: allAppointments.filter(
        (a) => a.status === AppointmentStatus.Confirmed,
      ).length,
      totalOffered: allAppointments.filter(
        (a) => a.status === AppointmentStatus.Offered,
      ).length,
      totalCompleted: allAppointments.filter(
        (a) => a.status === AppointmentStatus.Completed,
      ).length,
      totalCancelled: allAppointments.filter(
        (a) => a.status === AppointmentStatus.Cancelled,
      ).length,
    };
  }, [allAppointments]);

  const filteredAppointments = useMemo(
    () => allAppointments.filter((a) => a.status === activeTab),
    [allAppointments, activeTab],
  );

  const handleAccept = useCallback(
    (appointmentId: string) => {
      respondMutation.mutate({ appointmentId, isAccepted: true });
    },
    [respondMutation.mutate],
  );

  const handleDecline = useCallback(
    (appointmentId: string) => {
      respondMutation.mutate({ appointmentId, isAccepted: false });
    },
    [respondMutation.mutate],
  );

  const handleCancel = useCallback(
    (appointmentId: string) => {
      cancelMutation.mutate(appointmentId);
    },
    [cancelMutation.mutate],
  );

  const listHeader = (
    <View className="gap-6 pt-4 pb-2">
      {/* Greeting */}
      <View className="flex-row items-end justify-between px-4">
        <View className="gap-1 flex-1 mr-2">
          <Text className="text-2xl font-semibold text-brand-dark tracking-tight">
            {t(`professional.dashboard.greetings.${getGreetingKey()}`)}, Dr.{" "}
            {user?.lastName ?? "…"}
          </Text>
          <Text className="text-base text-brand-secondary/80">
            {t("professional.dashboard.overviewForToday")}
          </Text>
        </View>
        <Text className="text-sm font-medium text-brand-secondary/60 mb-0.5">
          {formatHeaderDate()}
        </Text>
      </View>

      {/* Today stats grid */}
      <View className="px-4">
        {isLoading ? (
          <View className="h-40 items-center justify-center">
            <ActivityIndicator size="large" color="#14d3ac" />
          </View>
        ) : (
          <TodayStatsGrid stats={stats} />
        )}
      </View>

      {/* Total appointments summary */}
      {!isLoading && (
        <View className="px-4">
          <TotalSummaryCard stats={stats} />
        </View>
      )}

      {/* Appointment list header */}
      <View className="gap-4 pb-2">
        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </View>
  );

  const renderItem = useCallback(
    ({ item }: { item: AppointmentDto }) => (
      <View className="px-4">
        <AppointmentCard
          appointment={item}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onCancel={handleCancel}
        />
      </View>
    ),
    [handleAccept, handleDecline, handleCancel],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listFooter = isFetchingNextPage ? (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color="#00546e" />
    </View>
  ) : null;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <AppHeader
        profilePictureUrl={user?.profilePictureUrl}
        scrollY={scrollY}
      />
      <Animated.FlatList
        data={filteredAppointments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          isLoading ? null : <EmptyState status={activeTab} />
        }
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}
