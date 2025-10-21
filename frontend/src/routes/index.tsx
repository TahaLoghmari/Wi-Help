import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
// import { LandingPage } from "@/pages/landing-page/landing-page";

export const Route = createFileRoute(ROUTE_PATHS.ROOT)({
//   component: LandingPage,
});
