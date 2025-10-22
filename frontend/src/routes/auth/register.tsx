import { ROUTE_PATHS } from "@/config/routes";
import { RegisterPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER)({
  component: RegisterPage,
  pendingComponent: PageLoading,
});
