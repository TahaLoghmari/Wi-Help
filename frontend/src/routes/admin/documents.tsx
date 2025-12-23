import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { AdminDocumentsLayout } from "@/features/admin/components/documents";

export const Route = createFileRoute(ROUTE_PATHS.ADMIN.DOCUMENTS)({
  component: AdminDocumentsLayout,
  pendingComponent: ContentLoading,
});
