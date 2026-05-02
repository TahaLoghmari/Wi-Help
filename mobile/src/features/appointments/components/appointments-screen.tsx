import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useGetProfessionalAppointments } from "@/api/appointments/get-professional-appointments";
import { useRespondToAppointment } from "@/api/appointments/respond-to-appointment";
import { useCancelAppointmentByProfessional } from "@/api/appointments/cancel-appointment-by-professional";
import { useCompleteAppointment } from "@/api/appointments/complete-appointment";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { CompleteAppointmentModal } from "@/features/appointments/components/complete-appointment-modal";
import {
  AppointmentStatus,
  type AppointmentDto,
} from "@/features/appointments/types/api.types";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/api/notifications/get-notifications";
import { useSelectedAppointmentStore } from "@/features/appointments/stores/use-selected-appointment-store";
import {
  FILTER_TABS,
  getGreetingKey,
  formatHeaderDate,
  isSameDay,
  type AppointmentStats,
} from "@/features/appointments/lib/utils";

import { TodayStatsGrid } from "./today-stats-grid";
import { TotalSummaryCard } from "./total-summary-card";
import { FilterTabs } from "@/components/filter-tabs";
import { EmptyState } from "./empty-state";

// ─── Main Screen ─────────────────────────────────────────────────────────────

const keyExtractor = (item: AppointmentDto) => item.id;

export function AppointmentsScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>(
    AppointmentStatus.Offered,
  );
  const [pendingCompleteAppointment, setPendingCompleteAppointment] =
    useState<AppointmentDto | null>(null);

  const { data: user } = useCurrentUser();
  const { data: notificationsData } = useNotifications();
  const hasUnread =
    notificationsData?.pages.flatMap((p) => p.items).some((n) => !n.isRead) ??
    false;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetProfessionalAppointments();

  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();
  const completeMutation = useCompleteAppointment();

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
    [respondMutation.mutate], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleDecline = useCallback(
    (appointmentId: string) => {
      respondMutation.mutate({ appointmentId, isAccepted: false });
    },
    [respondMutation.mutate], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleCancel = useCallback(
    (appointmentId: string) => {
      cancelMutation.mutate(appointmentId);
    },
    [cancelMutation.mutate], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleComplete = useCallback(
    (appointmentId: string) => {
      const appt = allAppointments.find((a) => a.id === appointmentId);
      if (appt) setPendingCompleteAppointment(appt);
    },
    [allAppointments],
  );

  const handleViewDetails = useCallback(
    (appointmentId: string) => {
      const appt = allAppointments.find((a) => a.id === appointmentId);
      if (appt) useSelectedAppointmentStore.getState().setAppointment(appt);
      router.push(`/(professional)/appointment/${appointmentId}`);
    },
    [allAppointments],
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
      {!isLoading && (
        <View className="gap-4 pb-2">
          <FilterTabs
            tabs={FILTER_TABS.map((tab) => ({
              key: tab,
              label: t(`professional.dashboard.stats.${tab.toLowerCase()}`),
            }))}
            active={activeTab}
            onChange={setActiveTab}
          />
        </View>
      )}
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
          onComplete={handleComplete}
          onViewDetails={handleViewDetails}
        />
      </View>
    ),
    [
      handleAccept,
      handleDecline,
      handleCancel,
      handleComplete,
      handleViewDetails,
    ],
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
      <AppHeader scrollY={scrollY} user={user} hasUnread={hasUnread} />
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
        keyboardDismissMode="on-drag"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <CompleteAppointmentModal
        visible={pendingCompleteAppointment !== null}
        appointment={pendingCompleteAppointment}
        onClose={() => setPendingCompleteAppointment(null)}
        onSubmit={(req) => {
          completeMutation.mutate(req, {
            onSuccess: () => setPendingCompleteAppointment(null),
          });
        }}
        isLoading={completeMutation.isPending}
      />
    </SafeAreaView>
  );
}
