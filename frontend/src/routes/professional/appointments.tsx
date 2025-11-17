import { ROUTE_PATHS } from "@/config/routes";
import { Appointments } from "@/features/professional";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS)({
  component: Appointments,
  pendingComponent: ContentLoading,
});
