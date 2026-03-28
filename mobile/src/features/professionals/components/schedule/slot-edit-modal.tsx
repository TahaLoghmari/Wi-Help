import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  HOUR_VALUES,
  MINUTE_VALUES,
  parseTime,
  buildTime,
  isTimeAfter,
} from "@/features/professionals/lib/utils";
import { WheelColumn } from "./wheel-column";

export interface SlotEditModalProps {
  visible: boolean;
  isEditing: boolean;
  initialStart: string;
  initialEnd: string;
  onSave: (startTime: string, endTime: string) => void;
  onClose: () => void;
}

export function SlotEditModal({
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
    ]).start(() => onClose());
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
    ]).start(() => onSave(start, end));
  }, [
    backdropOpacity,
    slideAnim,
    startHourIdx,
    startMinuteIdx,
    endHourIdx,
    endMinuteIdx,
    onSave,
    t,
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
          <View className="bg-white rounded-t-[20px]">
            {/* Drag handle */}
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 rounded bg-brand-secondary/15" />
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

              {/* Arrow separator */}
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
