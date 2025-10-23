import { ROUTE_PATHS } from "@/config/routes";
import { AuthLayout } from "@/features/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.ROOT)({
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
});
