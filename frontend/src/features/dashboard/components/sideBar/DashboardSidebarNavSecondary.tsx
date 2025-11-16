import { Link } from "@tanstack/react-router";
import type { SidebarNavProps } from "@/features/patient";
import { useDashboardSidebarStateStore } from "@/features/patient";

export function DashboardSidebarNavSecondary({
  items,
}: SidebarNavProps) {
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  return (
    <div className="flex flex-col gap-1 p-2">
      {items.map((item) => (
        <Link to={`/app/${item.url}` as any} key={item.title}>
          {({ isActive }) => (
            <div
              className={`flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm ${isActive ? "bg-primary text-secondary" : "hover:bg-sidebar-accent"}`}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {isSidebarOpen && <span>{item.title}</span>}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
