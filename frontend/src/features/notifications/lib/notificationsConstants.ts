import {
  CalendarPlus,
  CalendarCheck2,
  CalendarX2,
  FileText,
} from "lucide-react";
import type { NotificationType } from "@/features/notifications";
import type { ElementType } from "react";

export const NOTIFICATION_TYPE_TO_ICON: Record<NotificationType, ElementType> =
  {
    newAppointment: CalendarPlus,
    appointmentAccepted: CalendarCheck2,
    appointmentRejected: CalendarX2,
    appointmentCancelled: CalendarX2,
    appointmentCompleted: CalendarCheck2,
    newPrescription: FileText,
  };
