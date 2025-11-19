import { ROUTE_PATHS } from "@/config/routes";
import { AppointmentsLayout } from "@/features/patient";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.APPOINTMENTS)({
  component: AppointmentsLayout,
  pendingComponent: ContentLoading,
});
