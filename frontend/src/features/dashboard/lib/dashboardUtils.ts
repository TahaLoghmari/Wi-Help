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
      title: "Favorites",
      url: "favorites",
      icon: Heart,
    },
    {
      title: "Messages",
      url: "messages",
      icon: MessageSquare,
    },
  ];

  return {
    user: {
      name: user!.userName,
      email: user!.email,
      avatar: user!.imageUrl,
    },
    navMain: isProfessional
      ? professionalNavMain
      : isPatient
        ? patientNavMain
        : [],
    navSecondary: [
      {
        title: "Settings",
        url: "settings",
        icon: IconSettings,
      },
    ],
  };
}
