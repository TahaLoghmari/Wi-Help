import { ErrorComponent, MainErrorFallback } from "@/components";
import { env } from "@/config/env";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {env.isDevelopment && <TanStackRouterDevtools />}
    </>
  ),
  notFoundComponent: () => <ErrorComponent />,
  errorComponent: MainErrorFallback,
});
