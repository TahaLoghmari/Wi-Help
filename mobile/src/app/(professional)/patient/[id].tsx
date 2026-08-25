import React from "react";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { PatientProfileComposition } from "@/app-composition/profile-reviews";

export default function PatientProfileRoute() {
  const { id, backRoute } = useLocalSearchParams<{
    id: string;
    backRoute?: string;
  }>();

  const handleBack = () => {
    if (backRoute) {
      router.navigate(backRoute as Parameters<typeof router.navigate>[0]);
    } else {
      router.back();
    }
  };

  return <PatientProfileComposition patientId={id} onBack={handleBack} />;
}
