import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useGetSchedule } from "@/features/professionals/api";
import {
  DISPLAY_ORDER,
  DAY_KEYS,
  mergeWithAllDays,
} from "@/features/professionals/lib/utils";

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center gap-2 mb-3">
      <View className="h-px flex-1 bg-brand-secondary/10" />
      <Text className="text-[11px] font-medium tracking-wide uppercase text-brand-secondary/50">
        {title}
      </Text>
      <View className="h-px flex-1 bg-brand-secondary/10" />
    </View>
  );
}

export function ProfessionalProfileSchedule({
  professionalId,
}: {
  professionalId: string;
}) {
  const { t } = useTranslation();
  const { data: scheduleData, isLoading } = useGetSchedule(professionalId);

  const days = useMemo(
    () => (scheduleData ? mergeWithAllDays(scheduleData.days) : null),
    [scheduleData],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 8,
      }}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title={t("professionalProfile.schedule.title")} />
      {days === null ? (
        <View className="bg-white rounded-2xl border border-brand-secondary/10 p-6 items-center gap-2">
          <Ionicons
            name="calendar-outline"
            size={36}
            color="rgba(0,84,110,0.2)"
          />
          <Text className="text-base font-semibold text-brand-dark">
            {t("professionalProfile.schedule.title")}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {DISPLAY_ORDER.map((dayOfWeek) => {
            const dayData = days.find((d) => d.dayOfWeek === dayOfWeek);
            if (!dayData) return null;
            const dayName = t(
              `professional.schedule.days.${DAY_KEYS[dayData.dayOfWeek] ?? "monday"}`,
            );
            return (
              <View
                key={dayOfWeek}
                className="bg-white rounded-2xl border border-brand-secondary/10 overflow-hidden"
                style={{
                  shadowColor: "#00222e",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 1,
                }}
              >
                {/* Day header */}
                <View className="flex-row items-center px-4 py-3.5 gap-3">
                  <Text className="flex-1 text-sm font-semibold text-brand-dark">
                    {dayName}
                  </Text>
                  {dayData.isActive ? (
                    <View className="flex-row items-center gap-1.5 rounded-full bg-brand-teal/10 px-2.5 py-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      <Text className="text-xs font-semibold text-brand-dark">
                        {t("professionalProfile.schedule.available")}
                      </Text>
                    </View>
                  ) : (
                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: "rgba(0,84,110,0.45)" }}
                      >
                        {t("professionalProfile.schedule.unavailable")}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Slots */}
                {dayData.isActive && dayData.availabilitySlots.length > 0 && (
                  <View className="px-4 pb-3.5 gap-2">
                    <View className="h-px bg-brand-secondary/8 mb-1" />
                    <View className="flex-row flex-wrap gap-2">
                      {dayData.availabilitySlots.map((slot, idx) => (
                        <View
                          key={slot.id ?? `slot-${idx}`}
                          className="flex-row items-center gap-1.5 rounded-xl px-3 py-1.5"
                          style={{ backgroundColor: "rgba(0,84,110,0.07)" }}
                        >
                          <Text className="text-xs font-semibold text-brand-dark">
                            {slot.startTime}
                          </Text>
                          <Text className="text-xs text-brand-secondary/40">
                            →
                          </Text>
                          <Text className="text-xs font-semibold text-brand-dark">
                            {slot.endTime}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
