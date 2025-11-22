import { PageLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { DashboardLayout } from "@/features/dashboard";
import { ProfessionalGuard } from "@/components/Guards";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const ProfessionalDashboardSearchSchema = z.object({
  message: z.string().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.ROOT)({
  validateSearch: ProfessionalDashboardSearchSchema,
  component: () => (
    <ProfessionalGuard>
      <DashboardLayout />
    </ProfessionalGuard>
  ),
  pendingComponent: PageLoading,
});
