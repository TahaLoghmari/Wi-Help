export function TodayPatientsStat() {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          Today's Patients
        </div>
        <span className="border-brand-cream bg-brand-cream/70 text-brand-dark inline-flex items-center rounded-full border px-2 py-0.5 text-[11px]">
          09:00 - 17:00
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-brand-dark text-2xl font-semibold tracking-tight">
          18
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="">Checked-in</span>
          <span className="font-medium text-slate-800">7</span>
          <span className="h-3 w-px bg-slate-200"></span>
          <span>Pending</span>
          <span className="font-medium text-slate-800">11</span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="bg-brand-blue h-full w-1/2"></div>
        </div>
        <span className="text-[11px] text-slate-500">39% completed</span>
      </div>
    </div>
  );
}
