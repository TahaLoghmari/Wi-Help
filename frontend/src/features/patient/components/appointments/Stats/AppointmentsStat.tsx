import { GetPatientAppointments } from "@/features/patient";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { useTranslation } from "react-i18next";

export function AppointmentsStat() {
  const { t } = useTranslation();
  const { data } = GetPatientAppointments();
  const navigate = useNavigate();
  const now = new Date();
  const upcomingAppointments =
    data?.pages
      .flatMap((p) => p.items)
      .filter((a) => new Date(a.startDate) > now) || [];
  const confirmedUpcoming = upcomingAppointments.filter(
    (a) => a.status === "Confirmed",
  ).length;
  const offeredUpcoming = upcomingAppointments.filter(
    (a) => a.status === "Offered",
  ).length;

  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          {t("patient.appointments.stats.upcoming.title")}
        </div>
        <button
          onClick={() => navigate({ to: ROUTE_PATHS.PATIENT.FINDPROFESSIONAL })}
          className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-lucide="plus"
            className="lucide lucide-plus h-3.5 w-3.5 text-white"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          {t("patient.appointments.stats.upcoming.new")}
        </button>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {upcomingAppointments.length}
        </div>
        <div className="text-[11px] text-slate-500">
          {confirmedUpcoming}{" "}
          {t("patient.appointments.stats.upcoming.confirmed")} •{" "}
          {offeredUpcoming} {t("patient.appointments.stats.upcoming.offered")}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-blue inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.upcoming.thisWeek")}
          <span className="font-medium text-slate-700">
            {
              upcomingAppointments.filter(
                (a) =>
                  new Date(a.startDate) <=
                  new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
              ).length
            }
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-light inline-block h-2 w-2 rounded-full"></span>
          {t("patient.appointments.stats.upcoming.thisMonth")}
          <span className="font-medium text-slate-700">
            {
              upcomingAppointments.filter(
                (a) =>
                  new Date(a.startDate) <=
                  new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    now.getDate(),
                  ),
              ).length
            }
          </span>
        </div>
      </div>
    </div>
  );
}
