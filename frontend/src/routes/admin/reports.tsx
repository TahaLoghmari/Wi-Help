import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.REPORTS)({
  component: AdminReports,
  pendingComponent: ContentLoading,
});

function AdminReports() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Reports</h1>
      <p className="text-muted-foreground">
        Admin reports will be implemented here.
      </p>
    </div>
  );
}
