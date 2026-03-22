import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROUTE_PATHS } from "@/config/routes";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  if (user?.role === "Professional") {
    return <Redirect href={ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-bg">
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-semibold text-brand-dark">
          {t("common.welcome")}, {user?.firstName}
        </Text>
        <Text className="mt-1 text-base text-brand-secondary">
          {user?.email}
        </Text>

        <View className="mt-auto pb-8">
          <Button
            onPress={() => logout.mutate()}
            loading={logout.isPending}
            variant="outline"
          >
            {t("auth.signOut")}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
