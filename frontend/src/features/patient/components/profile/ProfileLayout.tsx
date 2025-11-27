import { GetCurrentPatient } from "@/features/patient";
import { PatientProfile } from "@/features/patient";
import { Spinner } from "@/components/ui";

export function ProfileLayout() {
  const { data: patient, isLoading, isError } = GetCurrentPatient();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">Error loading profile.</div>
    );
  }

  return <PatientProfile patient={patient} />;
}

{
  /* <section className="rounded-2xl border border-slate-200 bg-white p-4 text-xs shadow-sm shadow-slate-100">
  <div className="mb-2 flex items-center justify-between">
    <h3 className="text-xs font-semibold tracking-tight text-[#00394a]">
      Status &amp; Availability
    </h3>
  </div>
  <div className="mb-3 flex items-center justify-between">
    <span className="flex items-center gap-2 text-[11px] text-slate-700">
      <span className="inline-flex h-5 w-9 items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-0.5">
        <span className="inline-flex h-4 w-4 translate-x-4 items-center justify-center rounded-full bg-emerald-500 shadow-sm"></span>
      </span>
      <span className="font-medium text-slate-900">Go Online</span>
    </span>
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      Active
    </span>
  </div>
  <div className="mb-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
    <div className="mb-2 flex items-center justify-between text-[11px] text-slate-700">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="calendar-clock"
          className="h-3.5 w-3.5 text-slate-500"
          strokeWidth="1.5"
        ></svg>
        Weekly Availability
      </span>
      <span className="text-[10px] text-slate-500">Mon–Fri • 09:00–17:00</span>
    </div>
    <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Mon
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Tue
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Wed
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Thu
      </span>
      <span className="rounded-md border border-emerald-200 bg-white py-1 text-emerald-700">
        Fri
      </span>
    </div>
  </div>

  <div className="space-y-2 text-[11px] text-slate-700">
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2">
        <svg
          data-lucide="map-pin"
          className="h-3.5 w-3.5 text-slate-500"
          strokeWidth="1.5"
        ></svg>
        Service area
      </span>
      <span className="text-slate-500">
        Within <span className="font-semibold text-slate-900">10 km</span>
      </span>
    </div>
    <div className="flex h-20 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] text-slate-400">
      Map preview
    </div>
  </div>
</section>; */
}
