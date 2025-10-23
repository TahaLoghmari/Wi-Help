import { ResetPasswordPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const resetPasswordSearchSchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  pendingComponent: PageLoading,
  validateSearch: resetPasswordSearchSchema,
});
