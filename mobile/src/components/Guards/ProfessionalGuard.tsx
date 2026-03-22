import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ROUTE_PATHS } from "@/config/routes";

export function ProfessionalGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-bg">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href={ROUTE_PATHS.AUTH.LOGIN} />;
  }

  if (user.role !== "Professional") {
    return <Redirect href={ROUTE_PATHS.AUTH.LOGIN} />;
  }

  return <>{children}</>;
}
