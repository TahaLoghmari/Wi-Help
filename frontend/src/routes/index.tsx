import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { LandingPage } from "@/features/landing-page";

export const Route = createFileRoute(ROUTE_PATHS.ROOT)({
  component: LandingPage,
});
