import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components";

export const Route = createFileRoute("/professional/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return <ComingSoon />;
}
