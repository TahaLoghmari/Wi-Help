import { useCurrentScreenSize } from "@/hooks";
import { PanelRight } from "lucide-react";
import {
  DashboardHeaderDate,
  DashboardHeaderNotificationBell,
  useActiveNavigationPageStore,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";

export function DashboardHeader() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { currentScreenSize } = useCurrentScreenSize();
  const { activeNavigationPage } = useActiveNavigationPageStore();
  return (
    <div className="flex h-16 w-full shrink-0 items-center justify-between gap-1 border-b px-4 lg:gap-2 lg:px-6">
      <div className="flex items-center gap-3">
        <div
          className={`hover:bg-accent flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sm font-medium ${currentScreenSize < 1280 && currentScreenSize >= 768 && "hidden"}`}
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
          }}
        >
          <PanelRight className={`h-4 w-4`} />
        </div>
        <p
          className={`text-sm text-gray-300 ${currentScreenSize < 1280 && currentScreenSize >= 768 && "hidden"}`}
        >
          |
        </p>
        <p className="text-lg font-semibold tracking-tight text-[#00394a] sm:text-xl">
          {activeNavigationPage}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center rounded-full border border-slate-200 bg-[#fbfbfb] pt-1.5 pr-3 pb-1.5 pl-3 text-xs text-slate-700 md:flex">
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
            data-lucide="wallet"
            className="lucide lucide-wallet mr-2 h-3.5 w-3.5 text-slate-500"
          >
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
          </svg>
          <span className="text-[11px]">
            Wallet: <span className="font-medium text-slate-900">120 TND</span>
          </span>
        </div>
        <DashboardHeaderDate />
        <DashboardHeaderNotificationBell />
      </div>
    </div>
  );
}
