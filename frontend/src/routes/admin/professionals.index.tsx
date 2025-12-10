import { AdminProfessionalsLayout } from "@/features/admin";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/professionals/")({
  component: AdminProfessionalsLayout,
  pendingComponent: ContentLoading,
});
