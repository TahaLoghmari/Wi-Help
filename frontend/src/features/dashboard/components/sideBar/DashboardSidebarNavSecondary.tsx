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
          {({ isActive }: { isActive: boolean }) => {
            useEffect(() => {
              if (isActive) {
                setActiveNavigationPage(item.title + " Overview");
              }
            }, [isActive]);
            return (
              <div
                className={`group ${!isSidebarOpen && "justify-center"} flex items-center rounded-md px-3 py-2 ${isActive ? "text-brand-dark bg-[#fcf4d4] font-semibold" : "hover:bg-sidebar-accent"}`}
              >
                {isSidebarOpen && (
                  <span
                    className={`mr-3 h-7 w-1 rounded-full ${isActive ? "bg-brand-dark" : "bg-transparent group-hover:bg-slate-200"} transition-colors`}
                  ></span>
                )}
                <div
                  className={`text-brand-dark flex cursor-pointer items-center gap-3 rounded-md text-sm`}
                >
                  {item.icon && (
                    <item.icon
                      className={`h-4 w-4 ${isActive ? "text-brand-dark" : "group-hover:text-brand-dark text-slate-400"} `}
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
