import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.REVIEWS)({
  component: AdminReviews,
  pendingComponent: ContentLoading,
});

function AdminReviews() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Reviews</h1>
      <p className="text-muted-foreground">
        Admin reviews management will be implemented here.
      </p>
    </div>
  );
}
