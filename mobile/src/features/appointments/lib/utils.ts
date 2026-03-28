import { AppointmentStatus } from "@/features/appointments/types/api.types";

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function formatDate(dateString: string, todayLabel: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) return `${todayLabel}, ${time}`;

  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  return `${dayName}, ${dayMonth} · ${time}`;
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isToday) {
    return `Today, ${time}`;
  }
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayMonth = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${day}, ${dayMonth} · ${time}`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatDateOnly(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isSameDay(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function getGreetingKey(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function formatHeaderDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// ─── Badge style maps ─────────────────────────────────────────────────────────

export const statusStyles: Record<
  AppointmentStatus,
  { container: string; text: string }
> = {
  Offered: { container: "bg-brand-blue/10", text: "text-brand-blue" },
  Confirmed: { container: "bg-brand-teal/10", text: "text-brand-teal" },
  Completed: { container: "bg-brand-light/10", text: "text-emerald-600" },
  Cancelled: {
    container: "bg-brand-secondary/10",
    text: "text-brand-secondary",
  },
};

export const urgencyStyles: Record<
  string,
  { container: string; text: string }
> = {
  Low: { container: "bg-brand-teal/10", text: "text-brand-dark" },
  Medium: { container: "bg-brand-cream/60", text: "text-brand-dark" },
  High: { container: "bg-red-100", text: "text-red-600" },
};

// ─── Shared shadow ────────────────────────────────────────────────────────────

export const cardShadow = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 3,
};

// ─── Stats types ──────────────────────────────────────────────────────────────

export interface AppointmentStats {
  todayConfirmed: number;
  todayOffered: number;
  todayCompleted: number;
  todayCancelled: number;
  totalConfirmed: number;
  totalOffered: number;
  totalCompleted: number;
  totalCancelled: number;
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

export const FILTER_TABS: AppointmentStatus[] = [
  AppointmentStatus.Offered,
  AppointmentStatus.Confirmed,
  AppointmentStatus.Completed,
  AppointmentStatus.Cancelled,
];
