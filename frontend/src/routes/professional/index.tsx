import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.INDEX)({
  beforeLoad: () => {
    throw redirect({
      to: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS,
    });
  },
});
