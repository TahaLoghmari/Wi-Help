export function AppointmentsStat() {
  return (
    <div className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium tracking-tight text-slate-600">
          Appointments
        </div>
        <button className="inline-flex items-center gap-1 rounded-full bg-[#00394a] px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#00546e]">
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
          New
        </button>
      </div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold tracking-tight text-[#00394a]">
          24
        </div>
        <div className="text-[11px] text-slate-500">
          14 virtual • 10 in-person
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-[#3fa6ff]"></span>
          Confirmed
          <span className="font-medium text-slate-700">19</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span className="inline-block h-2 w-2 rounded-full bg-[#00e984]"></span>
          Available slots
          <span className="font-medium text-slate-700">6</span>
        </div>
      </div>
    </div>
  );
}
