import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser } from "@/features/auth/session";
import {
  AppointmentStatus,
  type AppointmentDto,
  useGetProfessionalAppointments,
} from "@/features/appointments/api";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { CompleteAppointmentModal } from "@/features/appointments/components/complete-appointment-modal";
import { useTranslation } from "react-i18next";
import type { AppHeaderRenderer } from "@/shared/ui/app-header";
import {
  FILTER_TABS,
  getGreetingKey,
  formatHeaderDate,
} from "@/features/appointments/lib/utils";
import {
  filterAppointmentsByStatus,
  getAppointmentStats,
} from "@/features/appointments/lib/appointment-presentation";

import { TodayStatsGrid } from "@/features/appointments/components/today-stats-grid";
import { TotalSummaryCard } from "@/features/appointments/components/total-summary-card";
import { FilterTabs } from "@/shared/ui/filter-tabs";
import { EmptyState } from "@/features/appointments/components/empty-state";
import { useAppointmentActions } from "@/features/appointments/hooks/use-appointment-actions";

// ─── Main Screen ─────────────────────────────────────────────────────────────

const keyExtractor = (item: AppointmentDto) => item.id;

interface AppointmentsScreenProps {
  onOpenAppointment: (appointmentId: string) => void;
  renderHeader?: AppHeaderRenderer;
}

export function AppointmentsScreen({
  onOpenAppointment,
  renderHeader,
}: AppointmentsScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>(
    AppointmentStatus.Offered,
  );
  const [pendingCompleteAppointment, setPendingCompleteAppointment] =
    useState<AppointmentDto | null>(null);

  const { data: user } = useCurrentUser();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetProfessionalAppointments();

  const actions = useAppointmentActions();

  const allAppointments = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const stats = useMemo(
    () => getAppointmentStats(allAppointments, new Date()),
    [allAppointments],
  );

  const filteredAppointments = useMemo(
    () => filterAppointmentsByStatus(allAppointments, activeTab),
    [allAppointments, activeTab],
  );

  const handleAccept = useCallback(
    (appointmentId: string) => actions.respond(appointmentId, true),
    [actions],
  );

  const handleDecline = useCallback(
    (appointmentId: string) => actions.respond(appointmentId, false),
    [actions],
  );

  const handleCancel = useCallback(
    (appointmentId: string) => actions.cancel(appointmentId),
    [actions],
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
      onOpenAppointment(appointmentId);
    },
    [onOpenAppointment],
  );

  const listHeader = (
    <View className="gap-6 pt-4 pb-2">
      {/* Greeting */}
      <View className="flex-row items-end justify-between px-4">
        <View className="gap-1 flex-1 mr-2">
          <Text className="text-2xl font-semibold text-brand-dark tracking-tight">
            {t(`professional.dashboard.greetings.${getGreetingKey(new Date())}`)}, Dr.{" "}
            {user?.lastName ?? "…"}
          </Text>
          <Text className="text-base text-brand-secondary/80">
            {t("professional.dashboard.overviewForToday")}
          </Text>
        </View>
        <Text className="text-sm font-medium text-brand-secondary/60 mb-0.5">
          {formatHeaderDate(new Date())}
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
      {renderHeader?.(scrollY)}
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
        onSubmit={(values) => {
          if (!pendingCompleteAppointment) return;
          actions.complete(
            pendingCompleteAppointment.id,
            values,
            () => setPendingCompleteAppointment(null),
          );
        }}
        isLoading={actions.isCompleting}
      />
    </SafeAreaView>
  );
}
