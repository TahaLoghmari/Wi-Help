import { useProfessionalFiltersStore } from "@/features/patient";
import { Slider } from "@/components/ui";
import { useTranslation } from "react-i18next";

export function FindProfessionalFilterbar() {
  const { t } = useTranslation();
  const { search, location, maxPrice, setSearch, setLocation, setMaxPrice } =
    useProfessionalFiltersStore();

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100 sm:p-5">
      <div className="grid items-center gap-3 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            {t("patient.findProfessional.filter.search.label")}
          </label>
          <div className="bg-brand-bg focus-within:border-brand-blue/70 focus-within:ring-brand-blue/60 flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-[11px] text-slate-500 transition-all focus-within:ring-1">
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
              data-lucide="search"
              className="lucide lucide-search group-hover:text-brand-dark size-4"
              data-icon-replaced="true"
            >
              <path d="m21 21-4.34-4.34" className=""></path>
              <circle cx="11" cy="11" r="8" className=""></circle>
            </svg>
            <input
              type="text"
              placeholder={t(
                "patient.findProfessional.filter.search.placeholder",
              )}
              className="w-full bg-transparent text-[11px] outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-slate-700">
            {t("patient.findProfessional.filter.location.label")}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={t(
                "patient.findProfessional.filter.location.placeholder",
              )}
              className="bg-brand-bg focus:border-brand-blue/70 focus:ring-brand-blue/60 w-full rounded-full border border-slate-200 px-3 py-2 pr-8 text-[11px] text-slate-700 placeholder:text-slate-400 focus:ring-1 focus:outline-none"
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
            {t("patient.findProfessional.filter.price.label")}
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
