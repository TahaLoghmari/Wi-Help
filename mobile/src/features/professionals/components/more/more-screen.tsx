import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { router } from "expo-router";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { AppHeader } from "@/components/app-header";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { useNotifications } from "@/api/notifications/get-notifications";
import { ROUTE_PATHS } from "@/config/routes";

export function MoreScreen() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const { data: notificationsData } = useNotifications();
  const hasUnread =
    notificationsData?.pages.flatMap((p) => p.items).some((n) => !n.isRead) ??
    false;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <AppHeader scrollY={scrollY} user={user} hasUnread={hasUnread} />
      <Animated.ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View className="py-6">
          <Text className="text-2xl font-bold text-brand-dark">
            {t("professional.more.title")}
          </Text>
        </View>

        {/* Profile section */}
        <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-secondary/50">
          {t("professional.more.profileSection")}
        </Text>
        <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white mb-6">
          <Pressable
            className="flex-row items-center justify-between px-4 py-3.5 active:opacity-70"
            onPress={() => router.push(ROUTE_PATHS.PROFESSIONAL.MY_PROFILE)}
            accessibilityRole="button"
            accessibilityLabel={t("professional.more.myProfile")}
          >
            <View className="flex-row items-center gap-x-3">
              <Ionicons
                name="person-circle-outline"
                size={20}
                color="#00546e"
              />
              <Text className="text-base font-medium text-brand-dark">
                {t("professional.more.myProfile")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(0,84,110,0.3)"
            />
          </Pressable>
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

        {/* Settings section */}
        <Text className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-brand-secondary/50">
          {t("professional.more.settingsSection")}
        </Text>
        <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3.5">
            <View className="flex-row items-center gap-x-3">
              <Ionicons name="settings-outline" size={20} color="#00546e" />
              <Text className="text-base font-medium text-brand-dark">
                {t("professional.more.settings")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(0,84,110,0.3)"
            />
          </View>
        </View>

        {/* Finance section */}
        <Text className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-brand-secondary/50">
          {t("professional.more.finance")}
        </Text>
        <View className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3.5">
            <View className="flex-row items-center gap-x-3">
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#00546e"
              />
              <Text className="text-base font-medium text-brand-dark">
                {t("professional.more.invoices")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(0,84,110,0.3)"
            />
          </View>
          <View className="h-px mx-4 bg-gray-100" />
          <View className="flex-row items-center justify-between px-4 py-3.5">
            <View className="flex-row items-center gap-x-3">
              <Ionicons name="card-outline" size={20} color="#00546e" />
              <Text className="text-base font-medium text-brand-dark">
                {t("professional.more.payments")}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="rgba(0,84,110,0.3)"
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
