// import { ErrorComponenet, MainErrorFallback } from "@/components";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  //   add later
  //   notFoundComponent: () => <ErrorComponenet />, // If no route matches, render this
  //   errorComponent: () => <MainErrorFallback />, // If there is an uncaught error
});
