import { type Address } from "@/features/auth";
import type {
  profileAndBioFormSchema,
  scheduleFormSchema,
} from "@/features/professional";
import type z from "zod";

export interface ProfessionalDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
  specialization: string;
  services: string[];
  experience: number;
  visitPrice: number;
  bio: string;
  isVerified: boolean;
  profilePictureUrl: string;
}

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type DayOfWeek = (typeof DAYS)[number];

// Helper function to get translated day names
export const getTranslatedDays = (t: (key: string) => string): string[] => {
  return [
    t("common.days.monday"),
    t("common.days.tuesday"),
    t("common.days.wednesday"),
    t("common.days.thursday"),
    t("common.days.friday"),
    t("common.days.saturday"),
    t("common.days.sunday"),
  ];
};

// Helper function to get translated day name by day of week
export const getTranslatedDay = (
  t: (key: string) => string,
  day: DayOfWeek,
): string => {
  const dayMap: Record<DayOfWeek, string> = {
    Monday: t("common.days.monday"),
    Tuesday: t("common.days.tuesday"),
    Wednesday: t("common.days.wednesday"),
    Thursday: t("common.days.thursday"),
    Friday: t("common.days.friday"),
    Saturday: t("common.days.saturday"),
    Sunday: t("common.days.sunday"),
  };
  return dayMap[day];
};

export interface DayAvailabilityDto {
  dayOfWeek: DayOfWeek;
  isActive: boolean;
  availabilitySlots: AvailabilitySlotDto[];
}

export interface AvailabilitySlotDto {
  id?: string | null;
  startTime: string;
  endTime: string;
}

export type UpdateProfessionalDto = z.infer<typeof profileAndBioFormSchema>;
export type SetupScheduleDto = z.infer<typeof scheduleFormSchema>;

export interface ProfessionalsQueryParametersDto {
  search?: string;
  location?: string;
  maxPrice?: number;
  availability?: string;
}

export const AppointmentStatus = {
  Offered: "Offered",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Cancelled: "Cancelled",
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const AppointmentUrgency = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
} as const;

export type AppointmentUrgency =
  (typeof AppointmentUrgency)[keyof typeof AppointmentUrgency];

export const DocumentType = {
  Diploma: "Diploma",
  ProfessionalLicense: "ProfessionalLicense",
  Id: "Id",
  Insurance: "Insurance",
} as const;

export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

export const DocumentStatus = {
  Pending: "Pending",
  Verified: "Verified",
  Rejected: "Rejected",
} as const;

export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

export interface VerificationDocumentDto {
  id: string;
  type: DocumentType;
  documentUrl: string;
  status: DocumentStatus;
  uploadedAt: string;
  reviewedAt: string | null;
}

export interface UploadVerificationDocumentRequest {
  documentType: DocumentType;
  document: File;
}
