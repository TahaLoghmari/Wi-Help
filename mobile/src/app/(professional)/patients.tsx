import { useCallback } from "react";
import { router } from "expo-router";
import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { getProfessionalPatientMessageRoute } from "@/app-composition/professional-patients";
import { ROUTE_PATHS } from "@/app-composition/routes";
import { useGetConversations } from "@/features/messaging/api";
import { PatientsScreen } from "@/features/patients";
import type { PatientDto } from "@/features/patients/api";

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
      renderHeader={(scrollY) => <ProfessionalAppHeader scrollY={scrollY} />}
      onMessage={handleMessage}
      onOpenPatient={handleOpenPatient}
    />
  );
}
