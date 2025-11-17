import { ROUTE_PATHS } from "@/config/routes";
import { UserGuard } from "@/components/Guards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(ROUTE_PATHS.PROFESSIONAL.INDEX)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <UserGuard>
      <div>Hello "/PROFESSIONAL/"!</div>
    </UserGuard>
  );
}
