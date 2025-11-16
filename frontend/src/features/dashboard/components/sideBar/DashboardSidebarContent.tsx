import { useCurrentUser } from "@/features/auth";
import {
  DashboardSidebarNavMain,
  DashboardSidebarNavSecondary,
  DashboardSidebarNavUser,
  getNavigationData,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";
import Icon2 from "@/assets/Icon-2.png";

export function DashboardSidebarContent({ className }: { className?: string }) {
  const { data: user } = useCurrentUser();
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  const navigationData = getNavigationData(user!);
  return (
    <div
      className={`bg-sidebar flex h-svh flex-col transition-[width,height,margin,padding] duration-200 focus:outline-none ${isSidebarOpen ? "w-[287px]" : "w-12"} ${className}`}
    >
      <div className="p-3">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-5">
            <img src={Icon2} alt="Logo" className="h-10" />
            <div className="flex flex-col">
              <p className="text-xl font-bold">Wi Help</p>
              <p className="text-muted-foreground text-xs">
                taking care of others is our priority
              </p>
            </div>
          </div>
        </div>
      </div>
      <DashboardSidebarNavMain items={navigationData.navMain} />
      <div className="mt-auto">
        <DashboardSidebarNavSecondary items={navigationData.navSecondary} />
        <DashboardSidebarNavUser user={navigationData.user} />
      </div>
    </div>
  );
}
