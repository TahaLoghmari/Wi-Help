import { router } from "expo-router";
import { ProfessionalAppHeader } from "@/app-composition/professional-app-header";
import { ROUTE_PATHS } from "@/config/routes";
import { AppointmentsScreen } from "@/features/appointments";

export default function ProfessionalAppointmentsRoute() {
  return (
    <AppointmentsScreen
      renderHeader={(scrollY) => <ProfessionalAppHeader scrollY={scrollY} />}
      onOpenAppointment={(id) =>
        router.push({
          pathname: ROUTE_PATHS.PROFESSIONAL.APPOINTMENT_DETAIL_PATHNAME,
          params: { id },
        })
      }
    />
  );
}
