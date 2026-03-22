import "@/global.css";
import React from "react";
import { Redirect } from "expo-router";
import { WelcomeScreen } from "@/features/auth/components/Welcome/WelcomeScreen";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ROUTE_PATHS } from "@/config/routes";

export default function WelcomeRoute() {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return null;

  if (user) {
    if (user.role === "Professional") {
      return <Redirect href={ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS} />;
    }
    return <Redirect href={ROUTE_PATHS.PATIENT.APPOINTMENTS} />;
  }

  return <WelcomeScreen />;
}
