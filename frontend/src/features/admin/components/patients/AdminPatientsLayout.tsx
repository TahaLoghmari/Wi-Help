import { AdminPatientsTable } from "./AdminPatientsTable";

export function AdminPatientsLayout() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          Patients
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage patient accounts and access
        </p>
      </div>
      <AdminPatientsTable />
    </div>
  );
}
