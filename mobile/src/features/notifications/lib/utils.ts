import { Ionicons } from "@expo/vector-icons";
import {
  NotificationType,
  type NotificationDto,
  type NotificationFilter,
} from "@/features/notifications/types/notifications.types";

// ─── Date helpers ─────────────────────────────────────────────────────────────

export function getDayKey(dateString: string): string {
  return dateString.slice(0, 10); // YYYY-MM-DD
}

export function getDayLabel(dayKey: string): string {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  if (dayKey === todayKey) return "Today";
  if (dayKey === yesterdayKey) return "Yesterday";

  const date = new Date(dayKey);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

export type NotificationIconConfig = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  bgClass: string;
  color: string;
};

export const ICON_MAP: Record<string, NotificationIconConfig> = {
  [NotificationType.newAppointment]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentAccepted]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentRejected]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentCancelled]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentCompleted]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.appointmentStatusUpdated]: {
    name: "calendar-outline",
    bgClass: "bg-brand-teal/10",
    color: "#14d3ac",
  },
  [NotificationType.newMessage]: {
    name: "chatbubble-outline",
    bgClass: "bg-brand-blue/10",
    color: "#3fa6ff",
  },
  [NotificationType.newReview]: {
    name: "star-outline",
    bgClass: "bg-brand-cream/30",
    color: "#00394a",
  },
};

export const FALLBACK_ICON: NotificationIconConfig = {
  name: "notifications-outline",
  bgClass: "bg-brand-secondary/10",
  color: "#00546e",
};

export function getIconConfig(type: string): NotificationIconConfig {
  return ICON_MAP[type] ?? FALLBACK_ICON;
}

// ─── List item types ──────────────────────────────────────────────────────────

export type SectionHeaderItem = { _kind: "header"; key: string; label: string };
export type NotificationItem = {
  _kind: "notification";
  key: string;
  notification: NotificationDto;
};
export type ListItem = SectionHeaderItem | NotificationItem;

export function buildListItems(notifications: NotificationDto[]): ListItem[] {
  if (notifications.length === 0) return [];

  const grouped = new Map<string, NotificationDto[]>();
  for (const n of notifications) {
    const key = getDayKey(n.createdAt);
    const group = grouped.get(key);
    if (group) {
      group.push(n);
    } else {
      grouped.set(key, [n]);
    }
  }

  const items: ListItem[] = [];
  for (const [dayKey, group] of grouped) {
    items.push({
      _kind: "header",
      key: `header-${dayKey}`,
      label: getDayLabel(dayKey),
    });
    for (const n of group) {
      items.push({ _kind: "notification", key: n.id, notification: n });
    }
  }
  return items;
}

// ─── Filter tabs config ───────────────────────────────────────────────────────

export const NOTIFICATION_FILTERS: {
  key: NotificationFilter;
  labelKey: string;
}[] = [
  { key: "all", labelKey: "professional.notifications.filters.all" },
  {
    key: "appointments",
    labelKey: "professional.notifications.filters.appointments",
  },
  {
    key: "messages",
    labelKey: "professional.notifications.filters.messages",
  },
  { key: "reviews", labelKey: "professional.notifications.filters.reviews" },
];

// ─── Skeleton widths ──────────────────────────────────────────────────────────

export const SKELETON_WIDTHS = [
  { title: "55%", msg1: "90%", msg2: "75%" },
  { title: "70%", msg1: "85%", msg2: "60%" },
  { title: "60%", msg1: "95%", msg2: "80%" },
  { title: "65%", msg1: "80%", msg2: "70%" },
  { title: "50%", msg1: "90%", msg2: "65%" },
  { title: "75%", msg1: "88%", msg2: "72%" },
] as const;

// ─── Shared shadow ────────────────────────────────────────────────────────────

export const CARD_SHADOW = {
  shadowColor: "#00220e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 12,
  elevation: 2,
};

// ─── List key extractor ───────────────────────────────────────────────────────

export const keyExtractor = (item: ListItem) => item.key;

// ─── Filtering ────────────────────────────────────────────────────────────────

export const APPOINTMENT_TYPES: string[] = [
  NotificationType.newAppointment,
  NotificationType.appointmentAccepted,
  NotificationType.appointmentRejected,
  NotificationType.appointmentCancelled,
  NotificationType.appointmentCompleted,
  NotificationType.newPrescription,
  NotificationType.appointmentStatusUpdated,
];

export function filterNotifications(
  notifications: NotificationDto[],
  filter: NotificationFilter,
): NotificationDto[] {
  switch (filter) {
    case "appointments":
      return notifications.filter((n) => APPOINTMENT_TYPES.includes(n.type));
    case "messages":
      return notifications.filter(
        (n) => n.type === NotificationType.newMessage,
      );
    case "reviews":
      return notifications.filter((n) => n.type === NotificationType.newReview);
    default:
      return notifications;
  }
}
