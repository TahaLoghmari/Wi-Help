import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { ScheduleTimings } from "@/features/professional";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.SCHEDULETIMINGS)({
  component: ScheduleTimings,
  pendingComponent: ContentLoading,
});
