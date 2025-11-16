import {
  DashboardSidebarContent,
  useDashboardOverallSidebarState,
} from "@/features/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useCurrentScreenSize } from "@/hooks";

export function DashboardSidebar() {
  const { isOverallSidebarOpen, setIsOverallSidebarOpen } =
    useDashboardOverallSidebarState();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <>
      {currentScreenSize < 768 ? (
        <Sheet
          open={isOverallSidebarOpen}
          onOpenChange={setIsOverallSidebarOpen}
        >
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
