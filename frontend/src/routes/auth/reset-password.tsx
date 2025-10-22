import { ResetPasswordPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

type ResetPasswordSearchParams = {
  email: string;
  token: string;
};

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  pendingComponent: PageLoading,
  validateSearch: (
    search: Record<string, unknown>
  ): ResetPasswordSearchParams => ({
    email: search.email as string,
    token: search.token as string,
  }),
});
