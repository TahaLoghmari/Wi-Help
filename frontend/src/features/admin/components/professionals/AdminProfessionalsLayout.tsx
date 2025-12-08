import { AdminProfessionalsTable } from "./AdminProfessionalsTable";

export function AdminProfessionalsLayout() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          Professionals
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage professional accounts and verification status
        </p>
      </div>
      <AdminProfessionalsTable />
    </div>
  );
}
