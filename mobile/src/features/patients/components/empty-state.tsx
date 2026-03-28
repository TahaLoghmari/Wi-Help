import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  hasQuery: boolean;
}

export function EmptyState({ hasQuery }: EmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View className="items-center mt-16 px-6 gap-3">
      <Ionicons name="people-outline" size={48} color="rgba(0,84,110,0.2)" />
      <Text className="text-base font-semibold text-brand-dark">
        {t("professional.patients.emptyTitle")}
      </Text>
      <Text className="text-sm text-brand-secondary/60 text-center">
        {hasQuery
          ? t("professional.patients.emptySearchSubtitle")
          : t("professional.patients.emptySubtitle")}
      </Text>
    </View>
  );
}
