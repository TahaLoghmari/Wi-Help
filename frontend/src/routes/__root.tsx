import { ErrorComponent, MainErrorFallback } from "@/components";
import { PageLoading } from "@/components/ui/page-loading";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: () => ErrorComponent,
  errorComponent: MainErrorFallback,
  pendingComponent: PageLoading,
});
