import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { MyProfessionalsLayout } from "@/features/patient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.MYPROFESSIONALS)({
  component: MyProfessionalsLayout,
  pendingComponent: ContentLoading,
});
