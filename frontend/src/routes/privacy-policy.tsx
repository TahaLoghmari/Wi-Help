import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { PrivacyPolicyPage } from "@/features/privacy-policy";

export const Route = createFileRoute(ROUTE_PATHS.PRIVACY_POLICY)({
  component: PrivacyPolicyPage,
});
