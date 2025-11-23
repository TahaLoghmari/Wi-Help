import type { UserDto } from "@/features/auth";
import { ROUTE_PATHS } from "@/config/routes";
import { IconSettings } from "@tabler/icons-react";
import {
  Calendar,
  Users,
  Clock,
  FileText,
  Star,
  MessageSquare,
  Heart,
  Search,
  ClipboardList,
  Pill,
  CreditCard,
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
      title: "Invoices",
      url: ROUTE_PATHS.PROFESSIONAL.INVOICES,
      icon: FileText,
    },
    {
      title: "Reviews",
      url: ROUTE_PATHS.PROFESSIONAL.REVIEWS,
      icon: Star,
    },
    {
      title: "Messages",
      url: ROUTE_PATHS.PROFESSIONAL.MESSAGES,
      icon: MessageSquare,
    },
  ];

  const patientNavMain = [
    {
      title: "Appointments",
      url: ROUTE_PATHS.PATIENT.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: "Find Professional",
      url: ROUTE_PATHS.PATIENT.FINDPROFESSIONAL,
      icon: Search,
    },
    {
      title: "Medical Records",
      url: ROUTE_PATHS.PATIENT.MEDICALRECORDS,
      icon: ClipboardList,
    },
    {
      title: "Prescriptions",
      url: ROUTE_PATHS.PATIENT.PRESCRIPTIONS,
      icon: Pill,
    },
    {
      title: "Billing",
      url: ROUTE_PATHS.PATIENT.BILLING,
      icon: CreditCard,
    },
    {
      title: "Favorites",
      url: ROUTE_PATHS.PATIENT.FAVORITES,
      icon: Heart,
    },
    {
      title: "Messages",
      url: ROUTE_PATHS.PATIENT.MESSAGES,
      icon: MessageSquare,
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
