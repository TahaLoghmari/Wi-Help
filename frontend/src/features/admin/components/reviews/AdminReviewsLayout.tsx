import { AdminReviewsTable } from "./AdminReviewsTable";
import { useTranslation } from "react-i18next";

export function AdminReviewsLayout() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6 p-6 overflow-auto">
      <div>
        <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
          {t("admin.reviews.title")}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {t("admin.reviews.subtitle")}
        </p>
      </div>
      <AdminReviewsTable />
    </div>
  );
}
