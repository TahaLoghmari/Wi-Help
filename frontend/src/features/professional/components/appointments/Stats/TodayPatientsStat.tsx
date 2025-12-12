import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

interface TodayPatientsStatProps {
  todayAppointments: number;
  confirmedCount: number;
  offeredCount: number;
  cancelledCount: number;
  completedCount: number;
  isLoading?: boolean;
}

export function TodayPatientsStat({
  todayAppointments,
  confirmedCount,
  offeredCount,
  cancelledCount,
  completedCount,
  isLoading,
}: TodayPatientsStatProps) {
  const { t } = useTranslation();
  const completedPercentage =
    todayAppointments > 0
      ? Math.round((completedCount / todayAppointments) * 100)
      : 0;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("professional.stats.today.title")}
        </div>
        <span className="border-brand-cream bg-brand-cream/70 text-brand-dark inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
          {t("professional.stats.today.badge")}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : todayAppointments}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          <span>
            {t("professional.stats.appointments.confirmed")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : confirmedCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("professional.stats.appointments.offered")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : offeredCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("professional.stats.appointments.cancelled")}{" "}
            <span className="font-medium text-slate-800">
              {isLoading ? "-" : cancelledCount}
            </span>
          </span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>
            {t("professional.stats.appointments.completed")}{" "}
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
          {t("professional.stats.today.completedPercentage")}
        </span>
      </div>
    </div>
  );
}
