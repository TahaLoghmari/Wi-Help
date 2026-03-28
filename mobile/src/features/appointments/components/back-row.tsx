import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export function BackRow() {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center gap-3 px-4 py-2">
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
  );
}
