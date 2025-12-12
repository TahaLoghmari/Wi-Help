import { GetPatientPrescriptions } from "@/features/patient";
import { useTranslation } from "react-i18next";

export function RecentPrescriptionsStat() {
  const { t } = useTranslation();
  const { data, isLoading } = GetPatientPrescriptions();
  const allPrescriptions = data?.pages.flatMap((p) => p.items) || [];

  // Calculate prescriptions from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPrescriptions = allPrescriptions.filter(
    (p) => new Date(p.issuedAt) >= thirtyDaysAgo,
  );

  const thisWeekCount = allPrescriptions.filter((p) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(p.issuedAt) >= sevenDaysAgo;
  }).length;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("patient.prescriptions.stats.recent")}
        </div>
        <span className="border-brand-cream bg-brand-cream/70 text-brand-dark inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
          {t("patient.prescriptions.stats.last30Days")}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : recentPrescriptions.length}
        </div>
        <div className="text-[11px] text-slate-500">
          {t("patient.prescriptions.stats.thisWeek")}{" "}
          <span className="font-medium text-slate-800">
            {isLoading ? "-" : thisWeekCount}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-teal inline-block h-2 w-2 rounded-full"></span>
          {t("patient.prescriptions.stats.receivedRecently")}
        </div>
      </div>
    </div>
  );
}
