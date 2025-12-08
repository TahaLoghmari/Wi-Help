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
  UserCheck,
  Star,
  Receipt,
  FolderOpen,
  BarChart3,
} from "lucide-react";

export function getNavigationData(user: UserDto) {
  const isProfessional = user.role.toLowerCase() === "professional";
  const isPatient = user.role.toLowerCase() === "patient";
  const isAdmin = user.role.toLowerCase() === "admin";

  const adminNavMain = [
    {
      title: "Appointments",
      url: ROUTE_PATHS.ADMIN.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: "Patients",
      url: ROUTE_PATHS.ADMIN.PATIENTS,
      icon: Users,
    },
    {
      title: "Professionals",
      url: ROUTE_PATHS.ADMIN.PROFESSIONALS,
      icon: UserCheck,
    },
    {
      title: "Reviews",
      url: ROUTE_PATHS.ADMIN.REVIEWS,
      icon: Star,
    },
    {
      title: "Transactions",
      url: ROUTE_PATHS.ADMIN.TRANSACTIONS,
      icon: Receipt,
    },
    {
      title: "Documents",
      url: ROUTE_PATHS.ADMIN.DOCUMENTS,
      icon: FolderOpen,
    },
    {
      title: "Reports",
      url: ROUTE_PATHS.ADMIN.REPORTS,
      icon: BarChart3,
    },
  ];

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
    {
      title: "Payment",
      url: ROUTE_PATHS.PROFESSIONAL.PAYMENT,
      icon: CreditCard,
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
    navMain: isAdmin
      ? adminNavMain
      : isProfessional
        ? professionalNavMain
        : isPatient
          ? patientNavMain
          : [],
    navSecondary: [
      {
        title: "Settings",
        url: isAdmin
          ? ROUTE_PATHS.ADMIN.SETTINGS
          : isProfessional
            ? ROUTE_PATHS.PROFESSIONAL.SETTINGS
            : ROUTE_PATHS.PATIENT.SETTINGS,
        icon: IconSettings,
      },
    ],
  };
}
