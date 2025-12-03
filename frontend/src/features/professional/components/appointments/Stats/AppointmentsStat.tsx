interface AppointmentsStatProps {
  totalAppointments: number;
  confirmedCount: number;
  offeredCount: number;
  isLoading?: boolean;
}

export function AppointmentsStat({
  totalAppointments,
  confirmedCount,
  offeredCount,
  isLoading,
}: AppointmentsStatProps) {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          Appointments
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          {isLoading ? "..." : totalAppointments}
        </div>
        <div className="text-[11px] text-slate-500">
          {isLoading
            ? "-"
            : `${confirmedCount} confirmed • ${offeredCount} pending`}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-blue inline-block h-2 w-2 rounded-full"></span>
          Confirmed
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : confirmedCount}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-light inline-block h-2 w-2 rounded-full"></span>
          Offered
          <span className="font-medium text-slate-700">
            {isLoading ? "-" : offeredCount}
          </span>
        </div>
      </div>
    </div>
  );
}
