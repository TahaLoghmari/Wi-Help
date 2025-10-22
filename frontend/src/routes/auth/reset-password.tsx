import { ResetPasswordPage } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

type ResetPasswordSearchParams = {
  email: string;
  token: string;
};

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (
    search: Record<string, unknown>
  ): ResetPasswordSearchParams => ({
    email: search.email as string,
    token: search.token as string,
  }),
});
