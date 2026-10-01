import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import type { AppHeaderRenderer } from "@/shared/ui/app-header";
import {
  useGetCurrentProfessional,
  useGetSchedule,
  useSetupSchedule,
} from "@/features/professionals/api";
import Toast from "react-native-toast-message";
import { useHandleApiError } from "@/shared/hooks/use-handle-api-error";
import {
  createInitialScheduleDraft,
  isScheduleDraftDirty,
  scheduleDraftReducer,
} from "@/features/professionals/model/schedule-draft";
import { DISPLAY_ORDER } from "@/features/professionals/lib/utils";
import { DayCard } from "@/features/professionals/components/schedule/day-card";
import { SlotEditModal } from "@/features/professionals/components/schedule/slot-edit-modal";
import { ScheduleSkeleton } from "@/features/professionals/components/schedule/schedule-skeleton";

// ─── ScheduleScreen ───────────────────────────────────────────────────────────

const SAVE_BUTTON_SHADOW = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 4,
};

export function ScheduleScreen({
  renderHeader,
}: {
  renderHeader?: AppHeaderRenderer;
}) {
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { data: professional, isLoading: isProfessionalLoading } =
    useGetCurrentProfessional();
  const { data: scheduleData, isLoading: isScheduleLoading } = useGetSchedule(
    professional?.id,
  );
  const isLoading = isProfessionalLoading || isScheduleLoading;
  const saveMutation = useSetupSchedule();
  const handleApiError = useHandleApiError();

  // ── Local draft state ─────────────────────────────────────────────────────
  const [scheduleDraft, dispatchScheduleDraft] = useReducer(
    scheduleDraftReducer,
    undefined,
    createInitialScheduleDraft,
  );
  const localDays = scheduleDraft.days;
  const isDirty = isScheduleDraftDirty(scheduleDraft);

  // Populate from server
  useEffect(() => {
    if (scheduleData && professional?.id) {
      dispatchScheduleDraft({
        type: "serverLoaded",
        professionalId: professional.id,
        days: scheduleData.days,
      });
    }
  }, [professional?.id, scheduleData]);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDayOfWeek, setEditingDayOfWeek] = useState<number>(1);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [modalInitialStart, setModalInitialStart] = useState("09:00");
  const [modalInitialEnd, setModalInitialEnd] = useState("10:00");

  // ── Day operations ─────────────────────────────────────────────────────────

  const handleToggleActive = useCallback((dayOfWeek: number) => {
    dispatchScheduleDraft({ type: "dayToggled", dayOfWeek });
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
      dispatchScheduleDraft({ type: "slotDeleted", dayOfWeek, slotIndex });
    },
    [],
  );

  const handleModalSave = useCallback(
    (startTime: string, endTime: string) => {
      dispatchScheduleDraft(
        editingSlotIndex === null
          ? {
              type: "slotAdded",
              dayOfWeek: editingDayOfWeek,
              startTime,
              endTime,
            }
          : {
              type: "slotEdited",
              dayOfWeek: editingDayOfWeek,
              slotIndex: editingSlotIndex,
              startTime,
              endTime,
            },
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
        dispatchScheduleDraft({
          type: "saveSucceeded",
          submittedDays: snapshot,
        });
        Toast.show({ type: "success", text1: "Schedule saved successfully" });
      },
      onError: handleApiError,
    });
  }, [handleApiError, localDays, saveMutation]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      {renderHeader?.(scrollY)}

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
