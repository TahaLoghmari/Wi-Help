import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { AppointmentStatus } from "@/features/appointments/types/api.types";

interface EmptyStateProps {
  status: AppointmentStatus;
}

export function EmptyState({ status }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View className="items-center py-12 gap-3">
      <Ionicons name="calendar-outline" size={48} color="rgba(0,84,110,0.2)" />
      <Text className="text-brand-secondary/50 text-base font-medium">
        {t("professional.dashboard.appointments.noAppointments", {
          status: t(`professional.dashboard.stats.${status.toLowerCase()}`),
        })}
      </Text>
    </View>
  );
}
