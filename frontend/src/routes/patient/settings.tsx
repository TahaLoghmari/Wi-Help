import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { SettingsLayout } from "@/features/patient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.SETTINGS)({
  component: SettingsLayout,
  pendingComponent: ContentLoading,
});
