import { ROUTE_PATHS } from "@/config/routes";
import { EmailVerificationPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const emailVerificationSearchSchema = z.object({
  email: z.email(),
});

export const Route = createFileRoute(ROUTE_PATHS.AUTH.EMAIL_VERIFICATION)({
  validateSearch: emailVerificationSearchSchema,
  component: EmailVerificationPage,
  pendingComponent: PageLoading,
});
