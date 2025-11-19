import { ROUTE_PATHS } from "@/config/routes";
import { FindProfessionalLayout } from "@/features/patient";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.FINDPROFESSIONAL)({
  component: FindProfessionalLayout,
  pendingComponent: ContentLoading,
});
