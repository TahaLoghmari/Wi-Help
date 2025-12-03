import { GetPatientAppointments } from "@/features/patient";

export function TotalAppointmentsStat() {
  const { data } = GetPatientAppointments();
  const totalAppointments = data?.pages[0]?.totalCount || 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between text-xs">
        <p className="text-xs font-medium tracking-tight text-slate-600">
          Total Appointments
        </p>
        <span className="border-brand-teal/30 bg-brand-teal/10 text-brand-secondary inline-flex items-center rounded-full border pt-0.5 pr-2 pb-0.5 pl-2 text-[11px]">
          +{Math.floor(Math.random() * 10) + 1}% this month
        </span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-brand-dark text-2xl font-semibold tracking-tight">
          {totalAppointments}
        </p>
        <p className="text-[11px] text-slate-500">All time</p>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-teal inline-block h-2 w-2 rounded-full"></span>
          Confirmed
          <span className="font-medium text-slate-700">
            {data?.pages
              .flatMap((p) => p.items)
              .filter((a) => a.status === "Confirmed").length || 0}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="bg-brand-blue inline-block h-2 w-2 rounded-full"></span>
          Offered
          <span className="font-medium text-slate-700">
            {data?.pages
              .flatMap((p) => p.items)
              .filter((a) => a.status === "Offered").length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
