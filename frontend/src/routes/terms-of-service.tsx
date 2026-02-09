import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { TermsOfServicePage } from "@/features/terms-of-service";

export const Route = createFileRoute(ROUTE_PATHS.TERMS_OF_SERVICE)({
  component: TermsOfServicePage,
});
