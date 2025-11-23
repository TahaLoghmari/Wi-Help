import {
  DashboardSidebarContent,
  useDashboardSidebarStateStore,
} from "@/features/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCurrentScreenSize } from "@/hooks";

export function DashboardSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <>
      {currentScreenSize < 1100 ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent
            side="left"
            className={`flex w-[287px] focus:outline-none`}
          >
            <DashboardSidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <DashboardSidebarContent className="border-r" />
        </>
      )}
    </>
  );
}
