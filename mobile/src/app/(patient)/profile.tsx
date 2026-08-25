import React from "react";
import { PatientProfileScreen } from "@/features/patients";

export default function PatientProfileRoute() {
  // Own profile — no patientId, no back button (navigated from header)
  return <PatientProfileScreen />;
}
