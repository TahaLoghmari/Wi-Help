import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import {
  type AuthorizedSessionRole,
  useCurrentUser,
} from "@/entities/session";
import { ROUTE_PATHS } from "@/config/routes";
import { GuardErrorState } from "./guard-error-state";

interface AuthGuardProps {
  children: React.ReactNode;
  role?: AuthorizedSessionRole;
}

export function AuthGuard({ children, role }: AuthGuardProps) {
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

  if (!user || user.role === "Unknown") {
    return <Redirect href={ROUTE_PATHS.AUTH.LOGIN} />;
  }

  if (role && user.role !== role) {
    return <Redirect href={ROUTE_PATHS.AUTH.LOGIN} />;
  }

  return <>{children}</>;
}
