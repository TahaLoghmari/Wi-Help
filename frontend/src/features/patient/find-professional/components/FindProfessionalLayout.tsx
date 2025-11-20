import { FindProfessionalFilterbar } from "@/features/patient";

export function FindProfessionalLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <FindProfessionalFilterbar />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-[#00394a]">
            18 professionals available near Lac 2
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Showing nurses, physiotherapists, and caregivers in Tunis (within 8
            km).
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="text-slate-500">Sort by</span>
          <div className="relative">
            <select className="appearance-none rounded-full border border-slate-200 bg-white px-3 py-1.5 pr-7 text-[11px] text-slate-700 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none">
              <option>Recommended</option>
              <option>Highest rating</option>
              <option>Soonest availability</option>
              <option>Lowest price</option>
            </select>
            <svg
              data-lucide="chevron-down"
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              stroke-width="1.5"
            ></svg>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100 p-4 flex flex-col gap-3 hover:border-[#3fa6ff]/70 hover:shadow-md hover:shadow-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&amp;fit=crop&amp;w=200&amp;q=80" className="h-10 w-10 rounded-full object-cover border border-slate-200" alt="Professional" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-medium tracking-tight text-slate-900 truncate">
                      Sarra Trabelsi
                    </h3>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Certified Home Nurse
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-slate-700">
                  <svg data-lucide="star" className="w-3.5 h-3.5 text-[#f5a623]" stroke-width="1.5" fill="currentColor"></svg>
                  <span className="font-medium">4.9</span>
                  <span className="text-slate-400">(132)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <svg data-lucide="map-pin" className="w-3.5 h-3.5" stroke-width="1.5"></svg>
                  <span className="truncate">Lac 2, Tunis</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-dashed border-slate-200">
                <div className="flex flex-col">
                  <span className="text-slate-400">Next availability</span>
                  <span className="font-medium text-slate-800">Today • 19:00</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-400">Home visit</span>
                  <span className="font-medium text-slate-800">45 TND</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full bg-[#00394a] text-[11px] text-white hover:bg-[#00546e] transition-colors">
                  <svg data-lucide="calendar-plus" className="w-3.5 h-3.5 text-white" stroke-width="1.5"></svg>
                  Book
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 transition-colors">
                  <svg data-lucide="eye" className="w-3.5 h-3.5 text-slate-500" stroke-width="1.5"></svg>
                  View profile
                </button>
              </div>
            </article>
      </div>
    </div>
  );
}
