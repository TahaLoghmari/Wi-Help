import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.INDEX)({
  beforeLoad: () => {
    throw redirect({
      to: ROUTE_PATHS.PATIENT.APPOINTMENTS,
    });
  },
});
