export function FindProfessionalFilterbar() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 sm:p-5">
      <div className="grid items-end gap-3 lg:grid-cols-[minmax(0,2.2fr)_repeat(3,minmax(0,1.2fr))_minmax(0,1.6fr)]">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Search
          </label>
          <div className="flex items-center rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 text-[11px] text-slate-500 transition-all focus-within:border-[#3fa6ff]/70 focus-within:ring-1 focus-within:ring-[#3fa6ff]/60">
            <svg
              data-lucide="search"
              className="mr-2 h-3.5 w-3.5 text-slate-400"
              stroke-width="1.5"
            ></svg>
            <input
              type="text"
              placeholder="Keyword, condition or name"
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Care type
          </label>
          <div className="relative">
            <select className="w-full appearance-none rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 pr-8 text-[11px] text-slate-700 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none">
              <option>Any</option>
              <option>Injection at home</option>
              <option>Wound care</option>
              <option>Physiotherapy</option>
              <option>Caregiver support</option>
            </select>
            <svg
              data-lucide="chevron-down"
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              stroke-width="1.5"
            ></svg>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Location
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Tunis, Sousse..."
              className="w-full rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 pr-8 text-[11px] text-slate-700 placeholder:text-slate-400 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
            />
            <svg
              data-lucide="map-pin"
              className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              stroke-width="1.5"
            ></svg>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Availability
          </label>
          <div className="relative">
            <select className="w-full appearance-none rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 pr-8 text-[11px] text-slate-700 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none">
              <option>Any time</option>
              <option>Today</option>
              <option>Within 24h</option>
              <option>This week</option>
            </select>
            <svg
              data-lucide="chevron-down"
              className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              stroke-width="1.5"
            ></svg>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Price range
          </label>
          <div className="mb-1 flex items-center justify-between text-[10px] text-slate-600">
            <span>25 TND</span>
            <span>120 TND</span>
          </div>
          <input
            type="range"
            min="25"
            max="120"
            value="60"
            className="w-full accent-[#00394a]"
          />
        </div>
      </div>
    </div>
  );
}
