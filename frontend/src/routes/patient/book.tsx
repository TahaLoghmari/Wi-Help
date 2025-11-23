import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/features/patient/book-appointments/book-appointments-page";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.BOOK)({
  component: BookingPage,
  pendingComponent: ContentLoading,
});
