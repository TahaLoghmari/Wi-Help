import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useCurrentUser } from "@/api/auth/use-current-user";
import { ROUTE_PATHS } from "@/config/routes";

interface AuthGuardProps {
  children: React.ReactNode;
  role?: "Professional" | "Patient";
}

export function AuthGuard({ children, role }: AuthGuardProps) {
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

  if (role && user.role !== role) {
    return <Redirect href={ROUTE_PATHS.AUTH.LOGIN} />;
  }

  return <>{children}</>;
}
