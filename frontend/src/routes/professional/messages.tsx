import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { Messages } from "@/features/professional";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.MESSAGES)({
  component: Messages,
  pendingComponent: ContentLoading,
});
