import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.PROFESSIONALS)({
  component: AdminProfessionals,
  pendingComponent: ContentLoading,
});

function AdminProfessionals() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Professionals</h1>
      <p className="text-muted-foreground">
        Admin professionals management will be implemented here.
      </p>
    </div>
  );
}
