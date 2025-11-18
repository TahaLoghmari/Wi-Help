import { ROUTE_PATHS } from "@/config/routes";
import { AppointmentsLayout } from "@/features/professional";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS)({
  component: AppointmentsLayout,
  pendingComponent: ContentLoading,
});
