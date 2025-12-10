import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminReviewsTable } from "@/features/admin/components/reviews";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.REVIEWS)({
  component: AdminReviews,
  pendingComponent: ContentLoading,
});

function AdminReviews() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Reviews
        </h1>
        <p className="text-sm text-slate-500">
          Monitor and manage patient reviews.
        </p>
      </div>

      <AdminReviewsTable />
    </div>
  );
}
