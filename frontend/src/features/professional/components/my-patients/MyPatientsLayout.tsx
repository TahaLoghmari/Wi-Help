import { MyPatientsCards } from "@/features/professional";

export function MyPatientsLayout() {
  return (
    <div className="flex h-full w-full flex-col gap-5 bg-[#fafafb] px-8 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-[#00394a]">
            My Patients
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500">
            A quick overview of key patients on your panel with direct
            communication actions.
          </p>
        </div>
        <button className="hidden items-center gap-1.5 gap-x-1.5 gap-y-1.5 rounded-full border border-slate-200 bg-white pt-1.5 pr-2.5 pb-1.5 pl-2.5 text-[11px] text-slate-700 transition-colors hover:border-[#3fa6ff]/70 hover:bg-[#3fa6ff]/5 sm:inline-flex">
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
            data-lucide="users"
            className="lucide lucide-users h-3.5 w-3.5 text-slate-500"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4" className=""></circle>
          </svg>
          View all
        </button>
      </div>
      <MyPatientsCards />
    </div>
  );
}
