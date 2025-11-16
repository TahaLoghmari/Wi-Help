import { PageLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { DashboardLayout } from "@/features/dashboard";
import { UserGuard } from "@/components/Guards";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const PatientDashboardSearchSchema = z.object({
  message: z.string().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.ROOT)({
  validateSearch: PatientDashboardSearchSchema,
  component: () => (
    <UserGuard>
      <DashboardLayout />
    </UserGuard>
  ),
  pendingComponent: PageLoading,
});
