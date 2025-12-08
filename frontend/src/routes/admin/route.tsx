import { PageLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { DashboardLayout } from "@/features/dashboard";
import { AdminGuard } from "@/components/Guards";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const AdminDashboardSearchSchema = z.object({
  message: z.string().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.ROOT)({
  validateSearch: AdminDashboardSearchSchema,
  component: () => (
    <AdminGuard>
      <DashboardLayout />
    </AdminGuard>
  ),
  pendingComponent: PageLoading,
});
