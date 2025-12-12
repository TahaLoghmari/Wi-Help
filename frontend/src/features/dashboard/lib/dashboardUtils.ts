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
} from "lucide-react";
import type { TFunction } from "i18next";

export function getNavigationData(user: UserDto, t: TFunction) {
  const isProfessional = user.role.toLowerCase() === "professional";
  const isPatient = user.role.toLowerCase() === "patient";
  const isAdmin = user.role.toLowerCase() === "admin";

  const adminNavMain = [
    {
      title: t("dashboard.sidebar.nav.appointments"),
      url: ROUTE_PATHS.ADMIN.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: t("dashboard.sidebar.nav.patients"),
      url: ROUTE_PATHS.ADMIN.PATIENTS,
      icon: Users,
    },
    {
      title: t("dashboard.sidebar.nav.professionals"),
      url: ROUTE_PATHS.ADMIN.PROFESSIONALS,
      icon: UserCheck,
    },
    {
      title: t("dashboard.sidebar.nav.reviews"),
      url: ROUTE_PATHS.ADMIN.REVIEWS,
      icon: Star,
    },
    {
      title: t("dashboard.sidebar.nav.transactions"),
      url: ROUTE_PATHS.ADMIN.TRANSACTIONS,
      icon: Receipt,
    },
    {
      title: t("dashboard.sidebar.nav.documents"),
      url: ROUTE_PATHS.ADMIN.DOCUMENTS,
      icon: FolderOpen,
    },
  ];

  const professionalNavMain = [
    {
      title: t("dashboard.sidebar.nav.appointments"),
      url: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: t("dashboard.sidebar.nav.myPatients"),
      url: ROUTE_PATHS.PROFESSIONAL.MYPATIENTS,
      icon: Users,
    },
    {
      title: t("dashboard.sidebar.nav.scheduleTimings"),
      url: ROUTE_PATHS.PROFESSIONAL.SCHEDULETIMINGS,
      icon: Clock,
    },

    {
      title: t("dashboard.sidebar.nav.messages"),
      url: ROUTE_PATHS.PROFESSIONAL.MESSAGES,
      icon: MessageSquare,
    },
    {
      title: t("dashboard.sidebar.nav.invoices"),
      url: ROUTE_PATHS.PROFESSIONAL.INVOICES,
      icon: FileText,
    },
    {
      title: t("dashboard.sidebar.nav.payment"),
      url: ROUTE_PATHS.PROFESSIONAL.PAYMENT,
      icon: CreditCard,
    },
  ];

  const patientNavMain = [
    {
      title: t("dashboard.sidebar.nav.appointments"),
      url: ROUTE_PATHS.PATIENT.APPOINTMENTS,
      icon: Calendar,
    },
    {
      title: t("dashboard.sidebar.nav.myProfessionals"),
      url: ROUTE_PATHS.PATIENT.MYPROFESSIONALS,
      icon: Stethoscope,
    },
    {
      title: t("dashboard.sidebar.nav.findProfessional"),
      url: ROUTE_PATHS.PATIENT.FINDPROFESSIONAL,
      icon: Search,
    },
    {
      title: t("dashboard.sidebar.nav.prescriptions"),
      url: ROUTE_PATHS.PATIENT.PRESCRIPTIONS,
      icon: Pill,
    },
    {
      title: t("dashboard.sidebar.nav.messages"),
      url: ROUTE_PATHS.PATIENT.MESSAGES,
      icon: MessageSquare,
    },
    {
      title: t("dashboard.sidebar.nav.billing"),
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
    navSecondary: !isAdmin
      ? [
          {
            title: t("dashboard.sidebar.nav.settings"),
            url: isProfessional
              ? ROUTE_PATHS.PROFESSIONAL.SETTINGS
              : ROUTE_PATHS.PATIENT.SETTINGS,
            icon: IconSettings,
          },
        ]
      : [],
  };
}
