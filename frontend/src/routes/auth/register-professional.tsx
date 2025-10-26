import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute } from "@tanstack/react-router";
import { RegisterProfessionalPage } from "@/features/auth";

export const Route = createFileRoute(ROUTE_PATHS.AUTH.REGISTER_PROFESSIONAL)({
  component: RegisterProfessionalPage,
});
