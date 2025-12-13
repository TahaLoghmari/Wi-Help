import { AdminProfessionalsTable } from "./AdminProfessionalsTable";
import { useTranslation } from "react-i18next";

export function AdminProfessionalsLayout() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          {t("admin.professionals.title")}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("admin.professionals.subtitle")}
        </p>
      </div>
      <AdminProfessionalsTable />
    </div>
  );
}
