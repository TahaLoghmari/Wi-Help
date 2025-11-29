export function DashboardHeaderDate() {
  const currentDate = new Date();
  const weekday = currentDate.toLocaleDateString("en-US", { weekday: "short" });
  const day = currentDate.getDate();
  const month = currentDate.toLocaleDateString("en-US", { month: "short" });
  const formattedDate = `${weekday}, ${day} ${month}`;

  return (
    <button className="hidden items-center gap-1.5 gap-x-1.5 gap-y-1.5 rounded-full border border-slate-200 bg-white pt-1.5 pr-3 pb-1.5 pl-3 text-xs text-slate-700 transition-colors hover:border-[#3fa6ff]/60 hover:bg-[#3fa6ff]/5 sm:inline-flex">
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
        data-lucide="calendar"
        className="lucide lucide-calendar h-3.5 w-3.5 text-slate-500"
      >
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2" className=""></rect>
        <path d="M3 10h18"></path>
      </svg>
      <span className="">{formattedDate}</span>
    </button>
  );
}
