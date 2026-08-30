import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCurrentUser } from "@/entities/session";
import {
  AppointmentStatus,
  type AppointmentDto,
  useCancelAppointmentByProfessional,
  useCompleteAppointment,
  useGetProfessionalAppointments,
  useRespondToAppointment,
} from "@/entities/appointment";
import Toast from "react-native-toast-message";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import { CompleteAppointmentModal } from "@/features/appointments/components/complete-appointment-modal";
import { useTranslation } from "react-i18next";
import type { AppHeaderRenderer } from "@/components/app-header";
import {
  FILTER_TABS,
  getGreetingKey,
  formatHeaderDate,
} from "@/features/appointments/lib/utils";
import {
  filterAppointmentsByStatus,
  getAppointmentStats,
} from "@/features/appointments/lib/appointment-presentation";

import { TodayStatsGrid } from "./today-stats-grid";
import { TotalSummaryCard } from "./total-summary-card";
import { FilterTabs } from "@/components/filter-tabs";
import { EmptyState } from "./empty-state";

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

  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();
  const completeMutation = useCompleteAppointment();
  const handleApiError = useHandleApiError();

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
    (appointmentId: string) => {
      respondMutation.mutate(
        { appointmentId, isAccepted: true },
        {
          onSuccess: () =>
            Toast.show({ type: "success", text1: "Appointment accepted" }),
          onError: handleApiError,
        },
      );
    },
    [handleApiError, respondMutation],
  );

  const handleDecline = useCallback(
    (appointmentId: string) => {
      respondMutation.mutate(
        { appointmentId, isAccepted: false },
        {
          onSuccess: () =>
            Toast.show({ type: "success", text1: "Appointment declined" }),
          onError: handleApiError,
        },
      );
    },
    [handleApiError, respondMutation],
  );

  const handleCancel = useCallback(
    (appointmentId: string) => {
      cancelMutation.mutate(appointmentId, {
        onSuccess: () =>
          Toast.show({ type: "success", text1: "Appointment cancelled" }),
        onError: handleApiError,
      });
    },
    [cancelMutation, handleApiError],
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
          completeMutation.mutate(
            { appointmentId: pendingCompleteAppointment.id, ...values },
            {
              onSuccess: () => {
                Toast.show({
                  type: "success",
                  text1: "Appointment completed",
                });
                setPendingCompleteAppointment(null);
              },
              onError: handleApiError,
            },
          );
        }}
        isLoading={completeMutation.isPending}
      />
    </SafeAreaView>
  );
}
