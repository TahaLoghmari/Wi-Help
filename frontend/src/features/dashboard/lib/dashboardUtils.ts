import type { UserDto } from "@/features/auth";
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
      url: "/professional/appointments",
      icon: Calendar,
    },
    {
      title: "My Patients",
      url: "/professional/my-patients",
      icon: Users,
    },
    {
      title: "Schedule Timings",
      url: "/professional/schedule-timings",
      icon: Clock,
    },
    {
      title: "Invoices",
      url: "/professional/invoices",
      icon: FileText,
    },
    {
      title: "Reviews",
      url: "/professional/reviews",
      icon: Star,
    },
    {
      title: "Messages",
      url: "/professional/messages",
      icon: MessageSquare,
    },
  ];

  const patientNavMain = [
    {
      title: "Appointments",
      url: "/patient/appointments",
      icon: Calendar,
    },
    {
      title: "Find Professional",
      url: "/patient/find-professional",
      icon: Search,
    },
    {
      title: "Medical Records",
      url: "/patient/medical-records",
      icon: ClipboardList,
    },
    {
      title: "Prescriptions",
      url: "/patient/prescriptions",
      icon: Pill,
    },
    {
      title: "Billing",
      url: "/patient/billing",
      icon: CreditCard,
    },
    {
      title: "Favorites",
      url: "/patient/favorites",
      icon: Heart,
    },
    {
      title: "Messages",
      url: "/patient/messages",
      icon: MessageSquare,
    },
  ];

  return {
    user: {
      name: user!.firstName + " " + user.lastName,
      email: user!.email,
      avatar: "",
    },
    navMain: isProfessional
      ? professionalNavMain
      : isPatient
        ? patientNavMain
        : [],
    navSecondary: [
      {
        title: "Settings",
        url: "/professional/settings",
        icon: IconSettings,
      },
    ],
  };
}
