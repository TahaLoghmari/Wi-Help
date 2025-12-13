import { AdminAppointmentsTable } from "./AdminAppointmentsTable";
import { useTranslation } from "react-i18next";

export function AdminAppointmentsLayout() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 overflow-auto p-6">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          {t("admin.appointments.title")}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("admin.appointments.subtitle")}
        </p>
      </div>
      <AdminAppointmentsTable />
    </div>
  );
}
