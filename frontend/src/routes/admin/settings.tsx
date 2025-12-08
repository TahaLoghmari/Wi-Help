import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.SETTINGS)({
  component: AdminSettings,
  pendingComponent: ContentLoading,
});

function AdminSettings() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Admin settings will be implemented here.
      </p>
    </div>
  );
}
