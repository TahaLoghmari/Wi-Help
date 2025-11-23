import { ContentLoading } from "@/components";
import { ProfileLayout } from "@/features/patient";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/patient/profile")({
  component: ProfileLayout,
  pendingComponent: ContentLoading,
});
