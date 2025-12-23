import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminReviewsLayout } from "@/features/admin/components/reviews";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.REVIEWS)({
  component: AdminReviewsLayout,
  pendingComponent: ContentLoading,
});
