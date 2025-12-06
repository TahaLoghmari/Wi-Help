import type { UserDto } from "@/features/auth";
import { ROUTE_PATHS } from "@/config/routes";
import { IconSettings } from "@tabler/icons-react";
import {
  Calendar,
  Users,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Pill,
  CreditCard,
  Stethoscope,
} from "lucide-react";

export function getNavigationData(user: UserDto) {
  const isProfessional = user.role.toLowerCase() === "professional";
  const isPatient = user.role.toLowerCase() === "patient";

  const professionalNavMain = [
    {
      title: "Appointments",
      url: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: "My Patients",
      url: ROUTE_PATHS.PROFESSIONAL.MYPATIENTS,
      icon: Users,
    },
    {
      title: "Schedule Timings",
      url: ROUTE_PATHS.PROFESSIONAL.SCHEDULETIMINGS,
      icon: Clock,
    },

    {
      title: "Messages",
      url: ROUTE_PATHS.PROFESSIONAL.MESSAGES,
      icon: MessageSquare,
    },
    {
      title: "Invoices",
      url: ROUTE_PATHS.PROFESSIONAL.INVOICES,
      icon: FileText,
    },
  ];

  const patientNavMain = [
    {
      title: "Appointments",
      url: ROUTE_PATHS.PATIENT.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: "My Professionals",
      url: ROUTE_PATHS.PATIENT.MYPROFESSIONALS,
      icon: Stethoscope,
    },
    {
      title: "Find Professional",
      url: ROUTE_PATHS.PATIENT.FINDPROFESSIONAL,
      icon: Search,
    },
    {
      title: "Prescriptions",
      url: ROUTE_PATHS.PATIENT.PRESCRIPTIONS,
      icon: Pill,
    },
    {
      title: "Messages",
      url: ROUTE_PATHS.PATIENT.MESSAGES,
      icon: MessageSquare,
    },
    {
      title: "Billing",
      url: ROUTE_PATHS.PATIENT.BILLING,
      icon: CreditCard,
    },
  ];

  return {
    user,
    navMain: isProfessional
      ? professionalNavMain
      : isPatient
        ? patientNavMain
        : [],
    navSecondary: [
      {
        title: "Settings",
        url: isProfessional
          ? ROUTE_PATHS.PROFESSIONAL.SETTINGS
          : ROUTE_PATHS.PATIENT.SETTINGS,
        icon: IconSettings,
      },
    ],
  };
}
