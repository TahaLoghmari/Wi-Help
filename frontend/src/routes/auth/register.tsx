import { ROUTE_PATHS } from "@/config/routes";
import { Register } from "@/features/auth";
import { PageLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const registerSearchSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER)({
  component: Register,
  pendingComponent: PageLoading,
  validateSearch: registerSearchSchema,
});
