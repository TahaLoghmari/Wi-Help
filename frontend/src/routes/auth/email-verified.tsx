import { ROUTE_PATHS } from "@/config/routes";
import { EmailVerifiedPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const emailVerifiedSearchSchema = z.object({
  status: z.enum(["success", "failed"]),
});

export const Route = createFileRoute(ROUTE_PATHS.AUTH.EMAIL_VERIFIED)({
  validateSearch: emailVerifiedSearchSchema,
  component: EmailVerifiedPage,
  pendingComponent: PageLoading,
});
