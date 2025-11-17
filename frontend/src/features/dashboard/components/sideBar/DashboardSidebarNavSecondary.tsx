import { Link } from "@tanstack/react-router";
import {
  useActiveNavigationPageStore,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";
import { useEffect } from "react";
import type { Icon } from "@tabler/icons-react";

interface DashboardSidebarNavSecondaryProps {
  items: {
    title: string;
    url: string;
    icon: Icon | React.ElementType;
  }[];
}

export function DashboardSidebarNavSecondary({
  items,
}: DashboardSidebarNavSecondaryProps) {
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  const { setActiveNavigationPage } = useActiveNavigationPageStore();
  return (
    <div className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => (
        <Link to={item.url} key={item.title}>
          {({ isActive }) => {
            useEffect(() => {
              if (isActive) {
                setActiveNavigationPage(item.title + " Overview");
              }
            }, [isActive]);
            return (
              <div
                className={`group flex items-center rounded-md px-3 py-2 ${isActive ? "bg-[#fcf4d4] font-semibold text-[#00394a]" : "hover:bg-sidebar-accent"}`}
              >
                <span
                  className={`mr-3 h-7 w-1 rounded-full ${isActive ? "bg-[#00394a]" : "bg-transparent group-hover:bg-slate-200"} transition-colors`}
                ></span>
                <div
                  className={`flex cursor-pointer items-center gap-3 rounded-md text-sm text-[#00394a]`}
                >
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4 ${isActive ? "text-[#00394a]" : "text-slate-400 group-hover:text-[#00394a]"} `}
                    />
                  )}
                  {isSidebarOpen && <span>{item.title}</span>}
                </div>
              </div>
            );
          }}
        </Link>
      ))}
    </div>
  );
}
