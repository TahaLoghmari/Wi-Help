import { ROUTE_PATHS } from "@/config/routes";
import { ContentLoading } from "@/components/ui";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BookingPage } from "@/features/patient/book-appointments/book-appointments-page";

const paramsSchema = z.object({
  professionalId: z.string(),
});

export const Route = createFileRoute(ROUTE_PATHS.PATIENT.BOOK)({
  params: {
    parse: paramsSchema.parse,
  },
  component: BookingPage,
  pendingComponent: ContentLoading,
});
