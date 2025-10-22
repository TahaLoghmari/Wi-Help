import { ROUTE_PATHS } from "@/config/routes";
import { EmailVerifiedPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

type EmailVerifiedSearch = {
  status: string;
};

export const Route = createFileRoute(ROUTE_PATHS.AUTH.EMAIL_VERIFIED)({
  validateSearch: (search: Record<string, unknown>): EmailVerifiedSearch => {
    return {
      status: search.status as string,
    };
  },
  component: EmailVerifiedPage,
  pendingComponent: PageLoading,
});
