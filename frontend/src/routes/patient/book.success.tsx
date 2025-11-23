import { ROUTE_PATHS } from "@/config/routes";
import { createFileRoute } from "@tanstack/react-router";
import { BookingSuccessPage } from "@/features/patient/book-appointments/success-page";

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.BOOK_SUCCESS)({
  component: BookingSuccessPage,
});
