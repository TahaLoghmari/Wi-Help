import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSelectedAppointmentStore } from "@/features/professional/stores/useSelectedAppointmentStore";
import { AppointmentDetailScreen } from "@/features/professional/components/appointments/AppointmentDetailScreen";
import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";

export default function AppointmentDetailRoute() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = useSelectedAppointmentStore((s) => s.appointment);

  // Guard: appointment must match the route id (handles stale store state)
  const matched = appointment?.id === id ? appointment : null;

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ProfessionalAppHeader />

      {/* Back header row */}
      <View className="flex-row items-center gap-3 px-4 py-2 ">
        <Pressable
          className="w-9 h-9 rounded-full border border-brand-secondary/15 items-center justify-center"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#00394a" />
        </Pressable>
        <Text
          className="text-base font-semibold text-brand-dark tracking-tight flex-1"
          numberOfLines={1}
        >
          {t("professional.dashboard.appointments.detail.title")}
        </Text>
      </View>

      {matched ? (
        <AppointmentDetailScreen appointment={matched} />
      ) : (
        <View className="flex-1 items-center justify-center px-6 gap-3">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color="rgba(0,84,110,0.2)"
          />
          <Text className="text-base font-semibold text-brand-dark">
            {t("professional.dashboard.appointments.detail.notFound")}
          </Text>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text className="text-sm text-brand-teal font-medium">
              {t("professional.dashboard.appointments.detail.goBack")}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
