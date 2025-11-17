import { ContentLoading } from "@/components";
import { ROUTE_PATHS } from "@/config/routes";
import { Reviews } from "@/features/professional";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.REVIEWS)({
  component: Reviews,
  pendingComponent: ContentLoading,
});
