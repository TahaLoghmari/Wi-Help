import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ProfessionalAppHeader } from "@/components/ProfessionalAppHeader";

export default function MoreScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ProfessionalAppHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-brand-dark">
            {t("professional.more.title")}
          </Text>
        </View>

        {/* Preferences section */}
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-secondary/50">
          {t("professional.more.preferences")}
        </Text>
        <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <View
            className="flex-row items-center justify-between px-4 py-3.5"
            accessibilityLabel={t("common.language")}
          >
            <View className="flex-row items-center gap-x-3">
              <Ionicons name="globe-outline" size={20} color="#00546e" />
              <Text className="text-base font-medium text-brand-dark">
                {t("common.language")}
              </Text>
            </View>
            <LanguageSwitcher />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
