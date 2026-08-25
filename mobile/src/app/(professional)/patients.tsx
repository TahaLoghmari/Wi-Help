import { useCallback } from "react";
import { router } from "expo-router";
import { getProfessionalPatientMessageRoute } from "@/app-composition/professional-patients";
import { ROUTE_PATHS } from "@/config/routes";
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
  const handleOpenPatient = useCallback((patient: PatientDto) => {
    router.push({
      pathname: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE_PATHNAME,
      params: {
        id: patient.id,
        backRoute: ROUTE_PATHS.PROFESSIONAL.PATIENTS,
      },
    });
  }, []);

  return (
    <PatientsScreen
      onMessage={handleMessage}
      onOpenPatient={handleOpenPatient}
    />
  );
}
