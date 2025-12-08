import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.APPOINTMENTS)({
  component: AdminAppointments,
  pendingComponent: ContentLoading,
});

function AdminAppointments() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Appointments</h1>
      <p className="text-muted-foreground">
        Admin appointments management will be implemented here.
      </p>
    </div>
  );
}
