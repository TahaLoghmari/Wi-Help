import { useTranslation } from "react-i18next";

interface AppointmentsStatProps {
  totalAppointments: number;
  confirmedCount: number;
  offeredCount: number;
  cancelledCount: number;
  completedCount: number;
  isLoading?: boolean;
}

export function AppointmentsStat({
  totalAppointments,
  confirmedCount,
  offeredCount,
  cancelledCount,
  completedCount,
  isLoading,
}: AppointmentsStatProps) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("professional.stats.appointments.title")}
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
          {t("professional.stats.appointments.completed")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : completedCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-blue inline-block h-2 w-2 rounded-full"></span>
          {t("professional.stats.appointments.confirmed")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : confirmedCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-cream inline-block h-2 w-2 rounded-full"></span>
          {t("professional.stats.appointments.offered")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : offeredCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-secondary inline-block h-2 w-2 rounded-full"></span>
          {t("professional.stats.appointments.cancelled")}
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : cancelledCount}
          </span>
        </div>
      </div>
    </div>
  );
}
