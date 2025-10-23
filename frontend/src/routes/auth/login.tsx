import { ROUTE_PATHS } from "@/config/routes";
import { LoginPage } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const loginSearchSchema = z.object({
  message: z.string().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.AUTH.LOGIN)({
  component: LoginPage,
  pendingComponent: PageLoading,
  validateSearch: loginSearchSchema,
});
