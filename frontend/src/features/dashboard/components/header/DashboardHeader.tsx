import { useCurrentScreenSize } from "@/hooks";
import { PanelRight } from "lucide-react";
import {
  DashboardHeaderNotificationBell,
  useDashboardOverallSidebarState,
} from "@/features/dashboard";

export function DashboardHeader() {
  const { isOverallSidebarOpen, setIsOverallSidebarOpen } =
    useDashboardOverallSidebarState();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <header className="flex h-12 items-center justify-center border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div
          className={`hover:bg-accent flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sm font-medium ${currentScreenSize < 1280 && currentScreenSize >= 768 && "hidden"}`}
          onClick={() => {
            if (currentScreenSize < 768) {
              setIsOverallSidebarOpen(!isOverallSidebarOpen);
            }
          }}
        >
          <PanelRight className={`h-4 w-4`} />
        </div>

        <p
          className={`text-sm text-gray-300 ${currentScreenSize < 1280 && currentScreenSize >= 768 && "hidden"}`}
        >
          |
        </p>
        <DashboardHeaderNotificationBell />
      </div>
    </header>
  );
}
