import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated as RNAnimated,
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView as NativeScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";
import { useGetCurrentProfessional } from "@/features/professional/hooks/useGetCurrentProfessional";
import { useGetSchedule } from "@/features/professional/hooks/useGetSchedule";
import { useSetupSchedule } from "@/features/professional/hooks/useSetupSchedule";
import {
  type AvailabilityDayDto,
  type AvailabilitySlotDto,
  type RawAvailabilityDayDto,
} from "@/features/professional/types/schedule.types";

// ─── Constants ──────────────────────────────────────────────────────────────

const HOUR_VALUES = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTE_VALUES = ["00", "15", "30", "45"];

const ITEM_H = 44;
const VISIBLE_ITEMS = 5;
const WHEEL_PAD = ITEM_H * 2;

const DAY_KEYS: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Map C# DayOfWeek enum string names (from JsonStringEnumConverter) to number.
const DAY_NAME_TO_NUMBER: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Display order: Monday (1) → Saturday (6) → Sunday (0)
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const CARD_SHADOW = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 16,
  elevation: 2,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseTime(time: string): { hourIdx: number; minuteIdx: number } {
  const [h, m] = time.split(":").map(Number);
  const minuteIdx = MINUTE_VALUES.indexOf(m.toString().padStart(2, "0"));
  return {
    hourIdx: Math.max(0, Math.min(23, h ?? 0)),
    minuteIdx: minuteIdx >= 0 ? minuteIdx : 0,
  };
}

function buildTime(hourIdx: number, minuteIdx: number): string {
  return `${HOUR_VALUES[hourIdx]}:${MINUTE_VALUES[minuteIdx]}`;
}

function isTimeAfter(start: string, end: string): boolean {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em > sh * 60 + sm;
}

/**
 * Normalise any TimeOnly.ToString() output to "HH:mm".
 * Handles: "09:00", "9:00", "09:00:00", "9:00:00 AM", "9:00 AM", etc.
 */
function normalizeTime(raw: string): string {
  // Strip AM/PM suffix if present (12-hour format)
  const cleaned = raw.trim().replace(/\s*(AM|PM)$/i, "");
  const parts = cleaned.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  // If PM (12-hour), shift to 24-hour
  const isPM = /PM/i.test(raw);
  const hour24 = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
  return `${String(hour24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function mergeWithAllDays(
  serverDays: RawAvailabilityDayDto[],
): AvailabilityDayDto[] {
  return [0, 1, 2, 3, 4, 5, 6].map((dow) => {
    const existing = serverDays.find((d) => {
      // The API returns dayOfWeek as a string (e.g. "Monday") due to JsonStringEnumConverter.
      const num = DAY_NAME_TO_NUMBER[d.dayOfWeek] ?? -1;
      return num === dow;
    });
    if (!existing)
      return { dayOfWeek: dow, isActive: false, availabilitySlots: [] };
    return {
      ...existing,
      dayOfWeek: dow,
      availabilitySlots: existing.availabilitySlots.map((s) => ({
        ...s,
        startTime: normalizeTime(s.startTime),
        endTime: normalizeTime(s.endTime),
      })),
    };
  });
}

// ─── WheelColumn ─────────────────────────────────────────────────────────────

interface WheelColumnProps {
  items: string[];
  initialIndex: number;
  onChange: (index: number) => void;
}

function WheelColumn({ items, initialIndex, onChange }: WheelColumnProps) {
  const scrollRef = useRef<NativeScrollView>(null);
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: initialIndex * ITEM_H,
        animated: false,
      });
    }, 60);
    return () => clearTimeout(t);
  }, [initialIndex]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const idx = Math.max(
        0,
        Math.min(items.length - 1, Math.round(offsetY / ITEM_H)),
      );
      setActiveIdx(idx);
      onChange(idx);
    },
    [items.length, onChange],
  );

  return (
    <View style={styles.wheelContainer}>
      {/* Selection highlight */}
      <View pointerEvents="none" style={styles.wheelHighlight} />

      <NativeScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
          setActiveIdx(Math.max(0, Math.min(items.length - 1, idx)));
        }}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: WHEEL_PAD }}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.wheelItem}>
            <Text
              style={[
                styles.wheelText,
                i === activeIdx
                  ? styles.wheelTextActive
                  : styles.wheelTextInactive,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </NativeScrollView>
    </View>
  );
}

// ─── SlotEditModal ────────────────────────────────────────────────────────────

interface SlotEditModalProps {
  visible: boolean;
  isEditing: boolean;
  initialStart: string;
  initialEnd: string;
  onSave: (startTime: string, endTime: string) => void;
  onClose: () => void;
}

function SlotEditModal({
  visible,
  isEditing,
  initialStart,
  initialEnd,
  onSave,
  onClose,
}: SlotEditModalProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new RNAnimated.Value(600)).current;
  const backdropOpacity = useRef(new RNAnimated.Value(0)).current;

  // Wheel indices
  const [openCount, setOpenCount] = useState(0);
  const [startHourIdx, setStartHourIdx] = useState(0);
  const [startMinuteIdx, setStartMinuteIdx] = useState(0);
  const [endHourIdx, setEndHourIdx] = useState(0);
  const [endMinuteIdx, setEndMinuteIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      const s = parseTime(initialStart);
      const e = parseTime(initialEnd);
      setStartHourIdx(s.hourIdx);
      setStartMinuteIdx(s.minuteIdx);
      setEndHourIdx(e.hourIdx);
      setEndMinuteIdx(e.minuteIdx);
      setError(null);
      setOpenCount((c) => c + 1);
    }
  }, [visible, initialStart, initialEnd]);

  const handleClose = useCallback(() => {
    RNAnimated.parallel([
      RNAnimated.timing(backdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [backdropOpacity, slideAnim, onClose]);

  const handleSave = useCallback(() => {
    const start = buildTime(startHourIdx, startMinuteIdx);
    const end = buildTime(endHourIdx, endMinuteIdx);
    if (!isTimeAfter(start, end)) {
      setError(t("professional.schedule.modal.errorEndAfterStart"));
      return;
    }
    setError(null);
    RNAnimated.parallel([
      RNAnimated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 600,
        duration: 230,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onSave(start, end);
    });
  }, [
    backdropOpacity,
    slideAnim,
    startHourIdx,
    startMinuteIdx,
    endHourIdx,
    endMinuteIdx,
    onSave,
  ]);

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent={true}
      onRequestClose={handleClose}
      onShow={() => {
        slideAnim.setValue(600);
        backdropOpacity.setValue(0);
        RNAnimated.parallel([
          RNAnimated.timing(backdropOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          RNAnimated.spring(slideAnim, {
            toValue: 0,
            damping: 28,
            stiffness: 220,
            useNativeDriver: true,
          }),
        ]).start();
      }}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <RNAnimated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.4)", opacity: backdropOpacity },
          ]}
        />
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
          accessibilityLabel={t("professional.schedule.accessibility.close")}
          accessibilityRole="button"
        />
      </View>

      <View className="flex-1 justify-end" pointerEvents="box-none">
        <RNAnimated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <View style={styles.modalSheet}>
            {/* Drag handle */}
            <View className="items-center pt-3 pb-2">
              <View style={styles.dragHandle} />
            </View>

            {/* Title */}
            <Text className="text-lg font-semibold text-brand-dark px-5 pb-5">
              {isEditing
                ? t("professional.schedule.modal.titleEdit")
                : t("professional.schedule.modal.titleAdd")}
            </Text>

            {/* Time pickers */}
            <View className="px-5 gap-3 mb-2">
              {/* Start time */}
              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-widest text-brand-secondary/60 text-center">
                  {t("professional.schedule.modal.startTime")}
                </Text>
                <View
                  className="flex-row items-center self-center rounded-xl border border-brand-secondary/15 bg-brand-bg overflow-hidden"
                  style={{ paddingHorizontal: 16 }}
                >
                  <WheelColumn
                    key={`sh-${openCount}`}
                    items={HOUR_VALUES}
                    initialIndex={startHourIdx}
                    onChange={setStartHourIdx}
                  />
                  <Text className="text-2xl font-semibold text-brand-secondary/40 px-2">
                    :
                  </Text>
                  <WheelColumn
                    key={`sm-${openCount}`}
                    items={MINUTE_VALUES}
                    initialIndex={startMinuteIdx}
                    onChange={setStartMinuteIdx}
                  />
                </View>
              </View>

              {/* Down arrow separator */}
              <View className="items-center">
                <Ionicons
                  name="arrow-down-outline"
                  size={20}
                  color="rgba(0,84,110,0.35)"
                />
              </View>

              {/* End time */}
              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase tracking-widest text-brand-secondary/60 text-center">
                  {t("professional.schedule.modal.endTime")}
                </Text>
                <View
                  className="flex-row items-center self-center rounded-xl border border-brand-secondary/15 bg-brand-bg overflow-hidden"
                  style={{ paddingHorizontal: 16 }}
                >
                  <WheelColumn
                    key={`eh-${openCount}`}
                    items={HOUR_VALUES}
                    initialIndex={endHourIdx}
                    onChange={setEndHourIdx}
                  />
                  <Text className="text-2xl font-semibold text-brand-secondary/40 px-2">
                    :
                  </Text>
                  <WheelColumn
                    key={`em-${openCount}`}
                    items={MINUTE_VALUES}
                    initialIndex={endMinuteIdx}
                    onChange={setEndMinuteIdx}
                  />
                </View>
              </View>
            </View>

            {/* Validation error */}
            {error ? (
              <Text className="text-brand-dark text-xs px-5 pt-1 pb-2">
                {error}
              </Text>
            ) : (
              <View className="h-6" />
            )}

            {/* Buttons */}
            <View
              className="px-5 gap-3"
              style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
            >
              <Pressable
                onPress={handleSave}
                className="h-12 rounded-full bg-brand-dark items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel={t(
                  "professional.schedule.accessibility.saveSlot",
                )}
              >
                <Text className="text-sm font-semibold text-white">
                  {t("professional.schedule.modal.saveSlot")}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleClose}
                className="h-10 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel={t("professional.schedule.modal.cancel")}
              >
                <Text className="text-sm font-medium text-brand-secondary/60">
                  {t("professional.schedule.modal.cancel")}
                </Text>
              </Pressable>
            </View>
          </View>
        </RNAnimated.View>
      </View>
    </Modal>
  );
}

// ─── DayCard ─────────────────────────────────────────────────────────────────

interface DayCardProps {
  dayData: AvailabilityDayDto;
  onToggleActive: (dayOfWeek: number) => void;
  onAddSlot: (dayOfWeek: number) => void;
  onDeleteSlot: (dayOfWeek: number, slotIndex: number) => void;
  onEditSlot: (dayOfWeek: number, slotIndex: number) => void;
}

function DayCard({
  dayData,
  onToggleActive,
  onAddSlot,
  onDeleteSlot,
  onEditSlot,
}: DayCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false);
  const contentHeightRef = useRef(0);
  const animHeight = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
    overflow: "hidden",
  }));

  // Auto-expand/collapse when isActive changes
  const prevActiveRef = useRef(dayData.isActive);
  useEffect(() => {
    if (dayData.isActive && !prevActiveRef.current) {
      // Activated: auto-expand
      expandedRef.current = true;
      setExpanded(true);
      const h = contentHeightRef.current || 130;
      animHeight.value = withTiming(h, { duration: 250 });
    } else if (!dayData.isActive && prevActiveRef.current) {
      // Deactivated: collapse
      expandedRef.current = false;
      setExpanded(false);
      animHeight.value = withTiming(0, { duration: 250 });
    }
    prevActiveRef.current = dayData.isActive;
  }, [dayData.isActive]);

  const handleToggle = useCallback(() => {
    const next = !expandedRef.current;
    expandedRef.current = next;
    setExpanded(next);
    const targetH = next && dayData.isActive ? contentHeightRef.current : 0;
    animHeight.value = withTiming(targetH || (next ? 130 : 0), {
      duration: 250,
    });
  }, [dayData.isActive]);

  const onMeasure = useCallback(
    (h: number) => {
      if (h > 0) {
        contentHeightRef.current = h;
        if (expandedRef.current && dayData.isActive) {
          animHeight.value = withTiming(h, { duration: 200 });
        }
      }
    },
    [dayData.isActive],
  );

  const slotCount = dayData.availabilitySlots.length;
  const dayName = t(
    `professional.schedule.days.${DAY_KEYS[dayData.dayOfWeek] ?? "monday"}`,
  );

  const slotContent = (
    <View className="px-4 pt-3 pb-4 gap-2.5">
      {dayData.availabilitySlots.map((slot, idx) => (
        <View
          key={slot.id ?? `slot-${idx}`}
          className="flex-row items-center gap-3"
        >
          {/* Start time pill */}
          <Pressable
            className="rounded-xl px-3 py-1.5"
            style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
            onPress={() => onEditSlot(dayData.dayOfWeek, idx)}
            accessibilityRole="button"
            accessibilityLabel={t(
              "professional.schedule.accessibility.editStartTime",
              { time: slot.startTime },
            )}
          >
            <Text className="text-sm font-semibold text-brand-dark">
              {slot.startTime}
            </Text>
          </Pressable>

          <Text className="text-sm text-brand-secondary/40">→</Text>

          {/* End time pill */}
          <Pressable
            className="rounded-xl px-3 py-1.5"
            style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
            onPress={() => onEditSlot(dayData.dayOfWeek, idx)}
            accessibilityRole="button"
            accessibilityLabel={t(
              "professional.schedule.accessibility.editEndTime",
              { time: slot.endTime },
            )}
          >
            <Text className="text-sm font-semibold text-brand-dark">
              {slot.endTime}
            </Text>
          </Pressable>

          <View className="flex-1" />

          {/* Delete button */}
          <Pressable
            onPress={() => onDeleteSlot(dayData.dayOfWeek, idx)}
            accessibilityRole="button"
            accessibilityLabel={t(
              "professional.schedule.accessibility.deleteSlot",
            )}
            hitSlop={8}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color="rgba(0,84,110,0.4)"
            />
          </Pressable>
        </View>
      ))}

      {/* Add slot button */}
      <Pressable
        onPress={() => onAddSlot(dayData.dayOfWeek)}
        className="h-10 rounded-full border border-brand-secondary/20 items-center justify-center mt-1"
        accessibilityRole="button"
        accessibilityLabel={t(
          "professional.schedule.accessibility.addTimeSlot",
        )}
      >
        <Text className="text-xs font-semibold text-brand-dark">
          {t("professional.schedule.dayCard.addSlot")}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View>
      {/* Visible card */}
      <View className="bg-white rounded-2xl" style={CARD_SHADOW}>
        {/* Header row */}
        <View className="flex-row items-center px-4 py-4 gap-3">
          <Text className="flex-1 text-sm font-semibold text-brand-dark">
            {dayName}
          </Text>

          {/* Slot count / Off pill */}
          {dayData.isActive ? (
            <View className="rounded-full bg-brand-teal/10 px-2.5 py-1">
              <Text className="text-xs font-semibold text-brand-dark">
                {t("professional.schedule.dayCard.slots", { count: slotCount })}
              </Text>
            </View>
          ) : (
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: "rgba(0,84,110,0.08)" }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: "rgba(0,84,110,0.5)" }}
              >
                {t("professional.schedule.dayCard.off")}
              </Text>
            </View>
          )}

          {/* Toggle switch */}
          <Switch
            value={dayData.isActive}
            onValueChange={() => onToggleActive(dayData.dayOfWeek)}
            trackColor={{
              false: "rgba(0,84,110,0.12)",
              true: "#14d3ac",
            }}
            thumbColor="white"
            ios_backgroundColor="rgba(0,84,110,0.12)"
            accessibilityRole="switch"
            accessibilityLabel={t(
              "professional.schedule.accessibility.dayToggle",
              {
                day: dayName,
                status: t(
                  dayData.isActive
                    ? "professional.schedule.accessibility.active"
                    : "professional.schedule.accessibility.inactive",
                ),
              },
            )}
          />

          {/* Expand chevron — only visible when active */}
          {dayData.isActive ? (
            <Pressable
              onPress={handleToggle}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                expanded
                  ? t("professional.schedule.accessibility.collapse")
                  : t("professional.schedule.accessibility.expand")
              }
            >
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#00546e"
              />
            </Pressable>
          ) : (
            <View style={{ width: 18 }} />
          )}
        </View>

        {/* Animated expanded section */}
        <Animated.View style={animStyle}>{slotContent}</Animated.View>
      </View>

      {/* Hidden measurement shadow — absolutely positioned, invisible */}
      <View
        pointerEvents="none"
        style={styles.measureShadow}
        onLayout={(e) => onMeasure(e.nativeEvent.layout.height)}
      >
        {slotContent}
      </View>
    </View>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonDayCard() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
    // Shared values are stable refs — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        CARD_SHADOW,
        animatedStyle,
        { backgroundColor: "white", borderRadius: 16 },
      ]}
    >
      <View className="flex-row items-center px-4 py-4 gap-3">
        <View className="h-4 w-24 rounded-full bg-brand-secondary/10 flex-1" />
        <View className="h-6 w-14 rounded-full bg-brand-secondary/10" />
        <View className="w-12 h-7 rounded-full bg-brand-secondary/10" />
        <View className="w-4 h-4 rounded bg-brand-secondary/10" />
      </View>
    </Animated.View>
  );
}

function ScheduleSkeleton() {
  return (
    <View className="px-4 gap-3">
      {DISPLAY_ORDER.map((d) => (
        <SkeletonDayCard key={d} />
      ))}
    </View>
  );
}

// ─── ScheduleScreen ───────────────────────────────────────────────────────────

export function ScheduleScreen() {
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { data: professional } = useGetCurrentProfessional();
  const { data: scheduleData, isLoading } = useGetSchedule(professional?.id);
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
      <ProfessionalAppHeader scrollY={scrollY} />

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
          className="rounded-full h-12 items-center justify-center flex-row gap-2 mx-4 my-2"
          style={[
            styles.saveButton,
            (!isDirty || saveMutation.isPending) && styles.saveButtonDisabled,
          ]}
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wheelContainer: {
    height: ITEM_H * VISIBLE_ITEMS,
    width: 72,
    overflow: "hidden",
  },
  wheelHighlight: {
    position: "absolute",
    top: WHEEL_PAD,
    left: 4,
    right: 4,
    height: ITEM_H,
    borderRadius: 10,
    backgroundColor: "rgba(0,57,74,0.07)",
    zIndex: 10,
  },
  wheelItem: {
    height: ITEM_H,
    alignItems: "center",
    justifyContent: "center",
  },
  wheelText: {
    fontSize: 20,
  },
  wheelTextActive: {
    color: "#00394a",
    fontWeight: "600",
  },
  wheelTextInactive: {
    color: "rgba(0,84,110,0.35)",
    fontWeight: "400",
  },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(0,84,110,0.15)",
  },
  measureShadow: {
    position: "absolute",
    opacity: 0,
    left: 0,
    right: 0,
    top: 0,
  },
  saveButton: {
    backgroundColor: "#00394a",
    shadowColor: "#00222e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "rgba(0,57,74,0.4)",
    shadowOpacity: 0,
    elevation: 0,
  },
});
