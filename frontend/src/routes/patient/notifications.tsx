import { createFileRoute } from "@tanstack/react-router";
import { Notifications } from "@/features/notifications";
import { ROUTE_PATHS } from "@/config";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.NOTIFICATIONS)({
  component: Notifications,
});
