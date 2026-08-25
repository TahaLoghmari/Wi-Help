import { useCallback } from "react";
import { router } from "expo-router";
import { getProfessionalPatientMessageRoute } from "@/app-composition/professional-patients";
import { useGetConversations } from "@/entities/messaging";
import { PatientsScreen } from "@/features/patients";
import type { PatientDto } from "@/entities/patient";

export default function ProfessionalPatientsRoute() {
  const { data: conversations = [] } = useGetConversations();
  const handleMessage = useCallback(
    (patient: PatientDto) => {
      router.push(
        getProfessionalPatientMessageRoute(patient, conversations),
      );
    },
    [conversations],
  );

  return <PatientsScreen onMessage={handleMessage} />;
}
