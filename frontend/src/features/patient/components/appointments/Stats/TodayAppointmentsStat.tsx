import { GetPatientAppointments } from "@/features/patient";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

export function TodayAppointmentsStat() {
  const { t } = useTranslation();
  const { data, isLoading } = GetPatientAppointments();
  const today = new Date().toDateString();
  const todayAppointments =
    data?.pages
      .flatMap((p) => p.items)
      .filter((a) => new Date(a.startDate).toDateString() === today) || [];
  const confirmedCount = todayAppointments.filter(
    (a) => a.status === "Confirmed",
  ).length;
  const offeredCount = todayAppointments.filter(
    (a) => a.status === "Offered",
  ).length;
  const cancelledCount = todayAppointments.filter(
    (a) => a.status === "Cancelled",
  ).length;
  const completedCount = todayAppointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const completedPercentage =
    todayAppointments.length > 0
      ? Math.round((completedCount / todayAppointments.length) * 100)
      : 0;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("patient.appointments.stats.today.title")}
        </div>
        <span className="border-brand-cream bg-brand-cream/70 text-brand-dark inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
          {t("patient.appointments.stats.today.badge")}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : todayAppointments.length}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          <span>
            {t("patient.appointments.stats.status.confirmed")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : confirmedCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("patient.appointments.stats.status.offered")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : offeredCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("patient.appointments.stats.status.cancelled")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : cancelledCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("patient.appointments.stats.status.completed")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : completedCount}
            </span>
          </span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <Progress value={completedPercentage} className="flex-1" />
        <span className="text-[11px] text-slate-500">
          {completedPercentage}
          {t("patient.appointments.stats.today.completed")}
        </span>
      </div>
    </div>
  );
}
