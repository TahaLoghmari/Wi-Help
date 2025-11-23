import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { ProfileLayout } from "@/features/professional";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.PROFILE)({
  pendingComponent: ContentLoading,
  component: ProfileLayout,
});
