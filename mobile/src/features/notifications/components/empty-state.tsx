import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import type { NotificationFilter } from "@/features/notifications/types/notifications.types";

interface EmptyStateProps {
  filter: NotificationFilter;
}

export function EmptyState({ filter }: EmptyStateProps) {
  const { t } = useTranslation();
  const subtitleKey =
    filter === "all"
      ? "professional.notifications.empty.subtitleAll"
      : filter === "appointments"
        ? "professional.notifications.empty.subtitleAppointments"
        : filter === "messages"
          ? "professional.notifications.empty.subtitleMessages"
          : "professional.notifications.empty.subtitleReviews";

  return (
    <View className="flex-1 items-center justify-center pt-16 px-6">
      <Ionicons
        name="notifications-off-outline"
        size={48}
        color="rgba(0,84,110,0.25)"
      />
      <Text className="text-base font-semibold text-brand-dark mt-4">
        {t("professional.notifications.empty.title")}
      </Text>
      <Text className="text-sm text-brand-secondary/60 mt-1 text-center">
        {t(subtitleKey)}
      </Text>
    </View>
  );
}
