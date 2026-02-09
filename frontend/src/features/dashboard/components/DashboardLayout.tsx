import {
  DashboardSidebar,
  DashboardSidebarLogoutButton,
  DashboardHeader,
  useDashboardSidebarStateStore,
  // useSignalRNotifications,
} from "@/features/dashboard";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/features/auth";
import { useCurrentScreenSize } from "@/hooks";
import { Route as ProfessionalRoute } from "@/routes/professional/route";
import { Route as PatientRoute } from "@/routes/patient/route";
import { Route as AdminRoute } from "@/routes/admin/route";
import { Outlet, useRouterState } from "@tanstack/react-router";

export function DashboardLayout() {
  const { setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { isLoading: isPending } = useCurrentUser();

  const { currentScreenSize } = useCurrentScreenSize();
  const routerState = useRouterState();
  const isPatientRoute = routerState.location.pathname.startsWith("/patient");
  const isAdminRoute = routerState.location.pathname.startsWith("/admin");

  // Use the appropriate route search based on the current route
  const adminSearch = isAdminRoute
    ? AdminRoute.useSearch()
    : { message: undefined };
  const professionalSearch =
    !isPatientRoute && !isAdminRoute
      ? ProfessionalRoute.useSearch()
      : { message: undefined };
  const patientSearch = isPatientRoute
    ? PatientRoute.useSearch()
    : { message: undefined };

  const message = isAdminRoute
    ? adminSearch.message
    : isPatientRoute
      ? patientSearch.message
      : professionalSearch.message;

  // useSignalRNotifications(user?.id);

  // this is for google signin/signup failing or any error when the redirection is comming from the backend with an error
  useEffect(() => {
    if (message) {
      toast.error(message);
      // User is already on their correct app, no need to navigate again
    }
  }, [message]);

  useEffect(() => {
    if (currentScreenSize >= 768 && currentScreenSize < 1280)
      setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [setIsSidebarOpen, currentScreenSize]);

  if (isPending)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex h-svh flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <Outlet />
        {/* this is a dialog */}
        <DashboardSidebarLogoutButton />
      </div>
    </div>
  );
}
