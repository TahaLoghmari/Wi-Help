import { ROUTE_PATHS } from "@/config/routes";
import { ForgotPasswordPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const forgotPasswordSearchSchema = z.object({
  email: z.email().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.AUTH.FORGOT_PASSWORD)({
  component: ForgotPasswordPage,
  pendingComponent: PageLoading,
  validateSearch: forgotPasswordSearchSchema,
});
