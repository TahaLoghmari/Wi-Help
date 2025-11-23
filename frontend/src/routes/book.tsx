import { BookingPage } from "@/features/patient/book-appointments/book-appointments-page";
import { createFileRoute } from "@tanstack/react-router";
import { ContentLoading } from "@/components/ui";
export const Route = createFileRoute("/book")({
  component: BookingPage,
  pendingComponent: ContentLoading,
});
