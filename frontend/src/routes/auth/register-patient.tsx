import { ROUTE_PATHS } from "@/config/routes";
import { RegisterPatientPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER_PATIENT)({
  component: RegisterPatientPage,
  pendingComponent: PageLoading,
});
