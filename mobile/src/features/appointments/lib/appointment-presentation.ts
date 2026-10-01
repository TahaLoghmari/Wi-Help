import {
  type AppointmentDto,
  AppointmentStatus,
} from "@/features/appointments/api";

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

export interface AppointmentActionPolicy {
  canAccept: boolean;
  canDecline: boolean;
  canComplete: boolean;
  canCancel: boolean;
  showActions: boolean;
}

export type AppointmentTimelineKey =
  | "offeredAt"
  | "confirmedAt"
  | "completedAt"
  | "cancelledAt";

export interface AppointmentTimelineEvent {
  key: AppointmentTimelineKey;
  occurredAt: string;
}

const actionPolicies: Record<AppointmentStatus, AppointmentActionPolicy> = {
  Offered: {
    canAccept: true,
    canDecline: true,
    canComplete: false,
    canCancel: false,
    showActions: true,
  },
  Confirmed: {
    canAccept: false,
    canDecline: false,
    canComplete: true,
    canCancel: true,
    showActions: true,
  },
  Completed: {
    canAccept: false,
    canDecline: false,
    canComplete: false,
    canCancel: false,
    showActions: false,
  },
  Cancelled: {
    canAccept: false,
    canDecline: false,
    canComplete: false,
    canCancel: false,
    showActions: false,
  },
};

const timelineKeys: AppointmentTimelineKey[] = [
  "offeredAt",
  "confirmedAt",
  "completedAt",
  "cancelledAt",
];

function isSameLocalDay(dateString: string, now: Date): boolean {
  const date = new Date(dateString);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function getAppointmentStats(
  appointments: readonly AppointmentDto[],
  now: Date,
): AppointmentStats {
  const stats: AppointmentStats = {
    todayConfirmed: 0,
    todayOffered: 0,
    todayCompleted: 0,
    todayCancelled: 0,
    totalConfirmed: 0,
    totalOffered: 0,
    totalCompleted: 0,
    totalCancelled: 0,
  };

  for (const appointment of appointments) {
    const status = appointment.status;
    stats[`total${status}`]++;
    if (isSameLocalDay(appointment.startDate, now)) {
      stats[`today${status}`]++;
    }
  }

  return stats;
}

export function filterAppointmentsByStatus(
  appointments: readonly AppointmentDto[],
  status: AppointmentStatus,
): AppointmentDto[] {
  return appointments.filter((appointment) => appointment.status === status);
}

export function getAppointmentActionPolicy(
  status: AppointmentStatus,
): AppointmentActionPolicy {
  return actionPolicies[status];
}

export function projectAppointmentTimeline(
  appointment: AppointmentDto,
): AppointmentTimelineEvent[] {
  const events: AppointmentTimelineEvent[] = [];

  for (const key of timelineKeys) {
    const occurredAt = appointment[key];
    if (occurredAt) events.push({ key, occurredAt });
  }

  return events;
}
