import { ROUTE_PATHS } from "@/config/routes";
import { ForgotPasswordPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

type ForgotPasswordSearchParams = {
  email?: string;
};

export const Route = createFileRoute(ROUTE_PATHS.AUTH.FORGOT_PASSWORD)({
  component: ForgotPasswordPage,
  pendingComponent: PageLoading,
  validateSearch: (
    search: Record<string, unknown>
  ): ForgotPasswordSearchParams => ({
    email: search.email as string,
  }),
});
