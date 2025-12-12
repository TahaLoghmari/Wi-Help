import { useCurrentUser } from "@/features/auth";
import {
  DashboardSidebarNavMain,
  DashboardSidebarNavSecondary,
  DashboardSidebarNavUser,
  getNavigationData,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";
import Icon2 from "@/assets/Icon-2.png";
import { useTranslation } from "react-i18next";

export function DashboardSidebarContent({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  const navigationData = getNavigationData(user!, t);
  return (
    <div
      className={`flex h-svh flex-col transition-[width,height,margin,padding] duration-200 focus:outline-none ${isSidebarOpen ? "w-[287px]" : "w-14"} ${className}`}
    >
      <div
        className={`flex h-16 shrink-0 items-center gap-5 border-b ${isSidebarOpen ? "px-6" : "justify-center px-2"}`}
      >
        <img src={Icon2} alt="Logo" className="h-10" />
        {isSidebarOpen && (
          <div className="flex flex-col">
            <p className="text-xl font-bold">Wi Help</p>
            <p className="text-muted-foreground text-xs">
              {t("dashboard.sidebar.slogan")}
            </p>
          </div>
        )}
      </div>
      <DashboardSidebarNavMain items={navigationData.navMain} />
      <div className="mt-auto">
        <DashboardSidebarNavSecondary items={navigationData.navSecondary} />
        <DashboardSidebarNavUser user={navigationData.user} />
      </div>
    </div>
  );
}
