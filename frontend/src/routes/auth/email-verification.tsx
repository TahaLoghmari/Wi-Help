import { ROUTE_PATHS } from "@/config/routes";
import { EmailVerificationPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

type EmailVerificationSearch = {
  email?: string;
};

export const Route = createFileRoute(ROUTE_PATHS.AUTH.EMAIL_VERIFICATION)({
  validateSearch: (
    search: Record<string, unknown>
  ): EmailVerificationSearch => {
    return {
      email: search.email as string,
    };
  },
  component: EmailVerificationPage,
  pendingComponent: PageLoading,
});
