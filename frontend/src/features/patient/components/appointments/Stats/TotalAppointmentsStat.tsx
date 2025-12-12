import { GetPatientAppointments } from "@/features/patient";
import { useTranslation } from "react-i18next";

export function TotalAppointmentsStat() {
  const { t } = useTranslation();
  const { data, isLoading } = GetPatientAppointments();
  const allAppointments = data?.pages.flatMap((p) => p.items) || [];
  const totalAppointments = data?.pages[0]?.totalCount || 0;
  const confirmedCount = allAppointments.filter(
    (a) => a.status === "Confirmed",
  ).length;
  const offeredCount = allAppointments.filter(
    (a) => a.status === "Offered",
  ).length;
  const cancelledCount = allAppointments.filter(
    (a) => a.status === "Cancelled",
  ).length;
  const completedCount = allAppointments.filter(
    (a) => a.status === "Completed",
  ).length;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("patient.appointments.stats.total.title")}
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : totalAppointments}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-teal inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.status.completed")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : completedCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-blue inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.status.confirmed")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : confirmedCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-cream inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.status.offered")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : offeredCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-secondary inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.status.cancelled")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : cancelledCount}
          </span>
        </div>
      </div>
    </div>
  );
}
