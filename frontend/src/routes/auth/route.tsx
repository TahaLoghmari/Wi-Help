import { ROUTE_PATHS } from "@/config/routes";
import { AuthLayout } from "@/features/auth";
import { GuestGuard } from "@/components/Guards";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.ROOT)({
  component: () => (
    <GuestGuard>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </GuestGuard>
  ),
});
