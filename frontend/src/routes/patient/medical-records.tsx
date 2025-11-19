import { ROUTE_PATHS } from "@/config/routes";
import { MedicalRecordsLayout } from "@/features/patient";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.MEDICALRECORDS)({
  component: MedicalRecordsLayout,
  pendingComponent: ContentLoading,
});
