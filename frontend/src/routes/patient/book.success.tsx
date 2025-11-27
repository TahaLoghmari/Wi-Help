import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute } from "@tanstack/react-router";
import { BookingSuccessPage } from "@/features/patient/components/book-appointments/BookingSuccessPage";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.BOOK_SUCCESS)({
  component: BookingSuccessPage,
});
