import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/app-header";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useNotifications } from "@/api/notifications/get-notifications";
import { useGetCurrentProfessional } from "@/api/professionals/get-current-professional";
import { useGetSchedule } from "@/api/professionals/get-schedule";
import { useSetupSchedule } from "@/api/professionals/setup-schedule";
import {
  type AvailabilityDayDto,
  type AvailabilitySlotDto,
} from "@/features/professionals/types/schedule.types";
import {
  DISPLAY_ORDER,
  mergeWithAllDays,
} from "@/features/professionals/lib/utils";
import { DayCard } from "./day-card";
import { SlotEditModal } from "./slot-edit-modal";
import { ScheduleSkeleton } from "./schedule-skeleton";

// ─── ScheduleScreen ───────────────────────────────────────────────────────────

const SAVE_BUTTON_SHADOW = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 4,
};

export function ScheduleScreen() {
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { data: user } = useCurrentUser();
  const { data: notificationsData } = useNotifications();
  const hasUnread =
    notificationsData?.pages.flatMap((p) => p.items).some((n) => !n.isRead) ??
    false;
  const { data: professional, isLoading: isProfessionalLoading } =
    useGetCurrentProfessional();
  const { data: scheduleData, isLoading: isScheduleLoading } = useGetSchedule(
    professional?.id,
  );
  const isLoading = isProfessionalLoading || isScheduleLoading;
  const saveMutation = useSetupSchedule();

  // ── Local draft state ─────────────────────────────────────────────────────
  const [localDays, setLocalDays] = useState<AvailabilityDayDto[]>(() =>
    mergeWithAllDays([]),
  );
  const [savedDays, setSavedDays] = useState<AvailabilityDayDto[]>(() =>
    mergeWithAllDays([]),
  );

  // Populate from server
  useEffect(() => {
    if (scheduleData) {
      const merged = mergeWithAllDays(scheduleData.days);
      setLocalDays(merged);
      setSavedDays(merged);
    }
  }, [scheduleData]);

  const isDirty = useMemo(() => {
    const normalize = (days: AvailabilityDayDto[]) =>
      days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        isActive: d.isActive,
        availabilitySlots: d.isActive ? d.availabilitySlots : [],
      }));
    return (
      JSON.stringify(normalize(localDays)) !==
      JSON.stringify(normalize(savedDays))
    );
  }, [localDays, savedDays]);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDayOfWeek, setEditingDayOfWeek] = useState<number>(1);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [modalInitialStart, setModalInitialStart] = useState("09:00");
  const [modalInitialEnd, setModalInitialEnd] = useState("10:00");

  // ── Day operations ─────────────────────────────────────────────────────────

  const handleToggleActive = useCallback((dayOfWeek: number) => {
    setLocalDays((prev) =>
      prev.map((d) => {
        if (d.dayOfWeek !== dayOfWeek) return d;
        const newIsActive = !d.isActive;
        return {
          ...d,
          isActive: newIsActive,
          // When activating with no slots, add a default slot
          availabilitySlots:
            newIsActive && d.availabilitySlots.length === 0
              ? [{ startTime: "09:00", endTime: "10:00" }]
              : d.availabilitySlots,
        };
      }),
    );
  }, []);

  const handleAddSlot = useCallback((dayOfWeek: number) => {
    setEditingDayOfWeek(dayOfWeek);
    setEditingSlotIndex(null);
    setModalInitialStart("09:00");
    setModalInitialEnd("10:00");
    setModalVisible(true);
  }, []);

  const handleEditSlot = useCallback(
    (dayOfWeek: number, slotIndex: number) => {
      const day = localDays.find((d) => d.dayOfWeek === dayOfWeek);
      const slot = day?.availabilitySlots[slotIndex];
      if (!slot) return;
      setEditingDayOfWeek(dayOfWeek);
      setEditingSlotIndex(slotIndex);
      setModalInitialStart(slot.startTime);
      setModalInitialEnd(slot.endTime);
      setModalVisible(true);
    },
    [localDays],
  );

  const handleDeleteSlot = useCallback(
    (dayOfWeek: number, slotIndex: number) => {
      setLocalDays((prev) =>
        prev.map((d) => {
          if (d.dayOfWeek !== dayOfWeek) return d;
          return {
            ...d,
            availabilitySlots: d.availabilitySlots.filter(
              (_, i) => i !== slotIndex,
            ),
          };
        }),
      );
    },
    [],
  );

  const handleModalSave = useCallback(
    (startTime: string, endTime: string) => {
      setLocalDays((prev) =>
        prev.map((d) => {
          if (d.dayOfWeek !== editingDayOfWeek) return d;
          const newSlot: AvailabilitySlotDto = { startTime, endTime };

          if (editingSlotIndex === null) {
            // Add new slot
            return {
              ...d,
              availabilitySlots: [...d.availabilitySlots, newSlot],
            };
          } else {
            // Update existing slot (preserve id if present)
            const updated = [...d.availabilitySlots];
            updated[editingSlotIndex] = {
              ...updated[editingSlotIndex],
              startTime,
              endTime,
            };
            return { ...d, availabilitySlots: updated };
          }
        }),
      );
      setModalVisible(false);
    },
    [editingDayOfWeek, editingSlotIndex],
  );

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  // ── Save schedule ──────────────────────────────────────────────────────────

  const handleSave = useCallback(() => {
    const snapshot = localDays;
    saveMutation.mutate(snapshot, {
      onSuccess: () => {
        setSavedDays(snapshot);
      },
    });
  }, [localDays, saveMutation]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <AppHeader scrollY={scrollY} user={user} hasUnread={hasUnread} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── Title section ── */}
        <View className="flex-row items-end justify-between px-4 pt-4 pb-2">
          <View className="gap-1 flex-1 mr-2">
            <Text className="text-2xl font-semibold text-brand-dark tracking-tight">
              {t("professional.schedule.title")}
            </Text>
            <Text className="text-sm text-brand-secondary/80">
              {t("professional.schedule.subtitle")}
            </Text>
          </View>
        </View>

        {/* ── Section label ── */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-xs font-semibold uppercase tracking-widest text-brand-secondary/60">
            {t("professional.schedule.sectionLabel")}
          </Text>
        </View>

        {/* ── Loading state ── */}
        {isLoading && <ScheduleSkeleton />}

        {/* ── Day cards ── */}
        {!isLoading && (
          <View className="px-4 gap-3">
            {DISPLAY_ORDER.map((dayOfWeek) => {
              const dayData = localDays.find((d) => d.dayOfWeek === dayOfWeek);
              if (!dayData) return null;
              return (
                <DayCard
                  key={dayOfWeek}
                  dayData={dayData}
                  onToggleActive={handleToggleActive}
                  onAddSlot={handleAddSlot}
                  onDeleteSlot={handleDeleteSlot}
                  onEditSlot={handleEditSlot}
                />
              );
            })}
          </View>
        )}
      </Animated.ScrollView>

      {/* ── Save button — inline footer, naturally sits above the tab bar ── */}
      {!isLoading && (
        <Pressable
          onPress={handleSave}
          disabled={!isDirty || saveMutation.isPending}
          className={clsx(
            "rounded-full h-12 items-center justify-center flex-row gap-2 mx-4 my-2",
            !isDirty || saveMutation.isPending
              ? "bg-brand-dark/40"
              : "bg-brand-dark",
          )}
          style={
            !isDirty || saveMutation.isPending ? undefined : SAVE_BUTTON_SHADOW
          }
          accessibilityRole="button"
          accessibilityLabel={t(
            "professional.schedule.accessibility.saveSchedule",
          )}
        >
          {saveMutation.isPending ? (
            <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />
          ) : (
            <Text
              className="text-sm font-semibold"
              style={{ color: isDirty ? "white" : "rgba(255,255,255,0.5)" }}
            >
              {t("professional.schedule.saveButton")}
            </Text>
          )}
        </Pressable>
      )}

      {/* ── Slot edit modal ── */}
      <SlotEditModal
        visible={modalVisible}
        isEditing={editingSlotIndex !== null}
        initialStart={modalInitialStart}
        initialEnd={modalInitialEnd}
        onSave={handleModalSave}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}
