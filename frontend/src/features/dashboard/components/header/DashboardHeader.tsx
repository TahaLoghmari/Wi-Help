import { useCurrentScreenSize } from "@/hooks";
import { PanelRight } from "lucide-react";
import {
  DashboardHeaderDate,
  DashboardHeaderNotificationBell,
  useActiveNavigationPageStore,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";
import { SearchBar } from "@/components/ui/search-bar";
import { useState } from "react";

export function DashboardHeader() {
  const [searchText, setSearchText] = useState("");
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { currentScreenSize } = useCurrentScreenSize();
  const { activeNavigationPage } = useActiveNavigationPageStore();
  return (
    <header className="flex h-[69px] w-full items-center justify-between gap-1 border-b px-4 lg:gap-2 lg:px-6">
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
        <SearchBar
          value={searchText}
          placeholder="Search appointments"
          onChange={setSearchText}
          className="w-full lg:w-sm"
        />
        <DashboardHeaderDate />
        <DashboardHeaderNotificationBell />
      </div>
    </header>
  );
}
