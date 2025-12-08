import { AdminAppointmentsTable } from "./AdminAppointmentsTable";

export function AdminAppointmentsLayout() {
  return (
    <div className="space-y-6 overflow-auto p-6">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          Appointments
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage and monitor all system appointments
        </p>
      </div>
      <AdminAppointmentsTable />
    </div>
  );
}
