import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View, Switch } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CARD_SHADOW, DAY_KEYS } from "@/features/professionals/lib/utils";
import { type AvailabilityDayDto } from "@/features/professionals/types/schedule.types";

export interface DayCardProps {
  dayData: AvailabilityDayDto;
  onToggleActive: (dayOfWeek: number) => void;
  onAddSlot: (dayOfWeek: number) => void;
  onDeleteSlot: (dayOfWeek: number, slotIndex: number) => void;
  onEditSlot: (dayOfWeek: number, slotIndex: number) => void;
}

export function DayCard({
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

  const prevActiveRef = useRef(dayData.isActive);
  useEffect(() => {
    if (dayData.isActive && !prevActiveRef.current) {
      expandedRef.current = true;
      setExpanded(true);
      const h = contentHeightRef.current || 130;
      animHeight.value = withTiming(h, { duration: 250 });
    } else if (!dayData.isActive && prevActiveRef.current) {
      expandedRef.current = false;
      setExpanded(false);
      animHeight.value = withTiming(0, { duration: 250 });
    }
    prevActiveRef.current = dayData.isActive;
  }, [dayData.isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggle = useCallback(() => {
    const next = !expandedRef.current;
    expandedRef.current = next;
    setExpanded(next);
    const targetH = next && dayData.isActive ? contentHeightRef.current : 0;
    animHeight.value = withTiming(targetH || (next ? 130 : 0), {
      duration: 250,
    });
  }, [dayData.isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMeasure = useCallback(
    (h: number) => {
      if (h > 0) {
        contentHeightRef.current = h;
        if (expandedRef.current && dayData.isActive) {
          animHeight.value = withTiming(h, { duration: 200 });
        }
      }
    },
    [dayData.isActive], // eslint-disable-line react-hooks/exhaustive-deps
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
      <View className="bg-white rounded-2xl" style={CARD_SHADOW}>
        {/* Header row */}
        <View className="flex-row items-center px-4 py-4 gap-3">
          <Text className="flex-1 text-sm font-semibold text-brand-dark">
            {dayName}
          </Text>

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

          <Switch
            value={dayData.isActive}
            onValueChange={() => onToggleActive(dayData.dayOfWeek)}
            trackColor={{ false: "rgba(0,84,110,0.12)", true: "#14d3ac" }}
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

        <Animated.View style={animStyle}>{slotContent}</Animated.View>
      </View>

      {/* Hidden measurement overlay */}
      <View
        pointerEvents="none"
        className="absolute opacity-0 inset-x-0 top-0"
        onLayout={(e) => onMeasure(e.nativeEvent.layout.height)}
      >
        {slotContent}
      </View>
    </View>
  );
}
