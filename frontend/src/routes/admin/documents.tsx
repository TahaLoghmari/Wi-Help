import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.DOCUMENTS)({
  component: AdminDocuments,
  pendingComponent: ContentLoading,
});

function AdminDocuments() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Documents</h1>
      <p className="text-muted-foreground">
        Admin documents management will be implemented here.
      </p>
    </div>
  );
}
