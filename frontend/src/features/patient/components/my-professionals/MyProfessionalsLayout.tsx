import { MyProfessionalsCards } from "./MyProfessionalsCards";

export function MyProfessionalsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-brand-dark text-sm font-semibold tracking-tight">
            My Professionals
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            A quick overview of healthcare professionals you've connected with
            for your care.
          </p>
        </div>
        <button className="hover:border-brand-blue/70 hover:bg-brand-blue/5 hidden items-center gap-1.5 gap-x-1.5 gap-y-1.5 rounded-full border border-slate-200 bg-white pt-1.5 pr-2.5 pb-1.5 pl-2.5 text-[11px] text-slate-700 transition-colors sm:inline-flex">
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
            data-lucide="stethoscope"
            className="lucide lucide-stethoscope h-3.5 w-3.5 text-slate-500"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
            <circle cx="20" cy="10" r="2"></circle>
          </svg>
          View all
        </button>
      </div>
      <MyProfessionalsCards />
    </div>
  );
}
