import { useProfessionalFiltersStore } from "@/features/patient";
import { Slider } from "@/components/ui";

export function FindProfessionalFilterbar() {
  const {
    search,
    location,
    maxPrice,
    availability,
    setSearch,
    setLocation,
    setMaxPrice,
    setAvailability,
  } = useProfessionalFiltersStore();

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 sm:p-5">
      <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1.2fr))_minmax(0,1.4fr)_auto]">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Search
          </label>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 text-[11px] text-slate-500 transition-all focus-within:border-[#3fa6ff]/70 focus-within:ring-1 focus-within:ring-[#3fa6ff]/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-lucide="search"
              className="lucide lucide-search size-4 group-hover:text-[#00394a]"
              data-icon-replaced="true"
            >
              <path d="m21 21-4.34-4.34" className=""></path>
              <circle cx="11" cy="11" r="8" className=""></circle>
            </svg>
            <input
              type="text"
              placeholder="Keyword, condition or name"
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <svg
              data-lucide="map-pin"
              className="absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              strokeWidth="1.5"
            ></svg>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Availability
          </label>
          <div className="relative">
            <select
              className="w-full appearance-none rounded-full border border-slate-200 bg-[#fbfbfb] px-3 py-2 pr-8 text-[11px] text-slate-700 focus:border-[#3fa6ff]/70 focus:ring-1 focus:ring-[#3fa6ff]/60 focus:outline-none"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option>Any time</option>
              <option>Today</option>
              <option>Within 24h</option>
              <option>This week</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              data-lucide="chevron-down"
              className="lucide lucide-chevron-down pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            Price range
          </label>
          <div className="mb-1 flex items-center justify-between text-[10px] text-slate-600">
            <span>25 TND</span>
            <span>{maxPrice} TND</span>
          </div>
          <Slider
            min={25}
            max={200}
            step={1}
            value={[maxPrice]}
            onValueChange={(value) => setMaxPrice(value[0])}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
