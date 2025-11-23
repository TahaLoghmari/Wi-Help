import { ROUTE_PATHS } from "@/config/routes";
import { ProfessionalProfileView } from "@/features/patient/find-professional/components";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.PROFESSIONAL_PROFILE)({
  component: ProfessionalProfileView,
  pendingComponent: ContentLoading,
});
