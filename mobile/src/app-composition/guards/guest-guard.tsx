import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useCurrentUser } from "@/features/auth/session";
import { ROUTE_PATHS } from "@/app-composition/routes";
import { GuardErrorState } from "./guard-error-state";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { data: user, isPending, isError, refetch } = useCurrentUser();

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-bg">
        <ActivityIndicator size="large" color="#00546e" />
      </View>
    );
  }

  if (isError) {
    return <GuardErrorState onRetry={refetch} />;
  }

  if (user) {
    if (user.role === "Professional") {
      return <Redirect href={ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS} />;
    }
    if (user.role === "Patient") {
      return <Redirect href={ROUTE_PATHS.PATIENT.APPOINTMENTS} />;
    }
  }

  return <>{children}</>;
}
