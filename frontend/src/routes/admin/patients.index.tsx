import { ROUTE_PATHS } from "@/config/routes";
import { AdminPatientsLayout } from "@/features/admin";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/patients/")({
  component: AdminPatientsLayout,
  pendingComponent: ContentLoading,
});
