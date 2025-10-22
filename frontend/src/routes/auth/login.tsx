import { ROUTE_PATHS } from "@/config/routes";
import { LoginPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

type LoginSearchParams = {
  message?: string;
};

export const Route = createFileRoute(ROUTE_PATHS.AUTH.LOGIN)({
  component: LoginPage,
  pendingComponent: PageLoading, 
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => ({
    message: search.message as string,
  }),
});
