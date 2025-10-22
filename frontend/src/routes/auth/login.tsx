import { ROUTE_PATHS } from "@/config/routes";
import { LoginPage } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

type LoginSearchParams = {
  message: string;
};

export const LoginRoute = createFileRoute(ROUTE_PATHS.AUTH.LOGIN)({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => ({
    message: (search.message as string) ?? "",
  }),
});
