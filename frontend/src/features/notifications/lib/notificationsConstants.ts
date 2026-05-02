import {
  CalendarPlus,
  CalendarCheck2,
  CalendarX2,
  CalendarClock,
  FileText,
  FileCheck2,
  MessageCircle,
  Star,
  UserCheck,
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
    appointmentStatusUpdated: CalendarClock,
    newPrescription: FileText,
    newMessage: MessageCircle,
    newReview: Star,
    accountStatusUpdated: UserCheck,
    documentStatusUpdated: FileCheck2,
  };
