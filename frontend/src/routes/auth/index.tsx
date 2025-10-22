import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.INDEX)({
  beforeLoad: () => {
    throw redirect({
      to: ROUTE_PATHS.AUTH.LOGIN,
    });
  },
});
