import { createFileRoute } from "@tanstack/react-router";
import { ContentLoading } from "@/components/ui";
import { BookingPage } from "@/features/patient/book-appointments/book-appointments-page";

export const Route = createFileRoute("/professional/book")({
  component: BookingPage,
  pendingComponent: ContentLoading,
});
