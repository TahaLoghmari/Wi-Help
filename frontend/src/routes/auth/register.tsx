import { ROUTE_PATHS } from "@/config/routes";
import { Register } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER)({
  component: Register,
  pendingComponent: PageLoading,
});
