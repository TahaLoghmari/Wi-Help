import React from "react";
import { PatientProfileComposition } from "@/app-composition/profile-reviews";

export default function PatientProfileRoute() {
  // Own profile — no patientId, no back button (navigated from header)
  return <PatientProfileComposition />;
}
