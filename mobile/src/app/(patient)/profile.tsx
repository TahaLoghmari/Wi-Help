import React from "react";
import { PatientProfileScreen } from "@/features/patients/components/patient-profile-screen";

export default function PatientProfileRoute() {
  // Own profile — no patientId, no back button (navigated from header)
  return <PatientProfileScreen />;
}
