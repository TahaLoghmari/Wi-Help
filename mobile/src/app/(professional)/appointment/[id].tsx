import { router, useLocalSearchParams } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";
import { AppointmentDetailScreen } from "@/features/appointments";

export default function AppointmentDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <AppointmentDetailScreen
      id={id}
      onBack={() => router.back()}
      onOpenPatient={(patientId) =>
        router.push({
          pathname: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE_PATHNAME,
          params: { id: patientId },
        })
      }
    />
  );
}
