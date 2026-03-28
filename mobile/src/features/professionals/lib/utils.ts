import type {
  RawAvailabilityDayDto,
  AvailabilityDayDto,
} from "@/features/professionals/types/schedule.types";

// ─── Constants ─────────────────────────────────────────────────────────────────

export const HOUR_VALUES = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
export const MINUTE_VALUES = ["00", "15", "30", "45"];

export const ITEM_H = 44;
export const VISIBLE_ITEMS = 5;
export const WHEEL_PAD = ITEM_H * 2;

export const DAY_KEYS: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// Map C# DayOfWeek enum string names (from JsonStringEnumConverter) to number.
export const DAY_NAME_TO_NUMBER: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Display order: Monday (1) → Saturday (6) → Sunday (0)
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export const CARD_SHADOW = {
  shadowColor: "#00222e",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.04,
  shadowRadius: 16,
  elevation: 2,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function parseTime(time: string): {
  hourIdx: number;
  minuteIdx: number;
} {
  const [h, m] = time.split(":").map(Number);
  const minuteIdx = MINUTE_VALUES.indexOf(m.toString().padStart(2, "0"));
  return {
    hourIdx: Math.max(0, Math.min(23, h ?? 0)),
    minuteIdx: minuteIdx >= 0 ? minuteIdx : 0,
  };
}

export function buildTime(hourIdx: number, minuteIdx: number): string {
  return `${HOUR_VALUES[hourIdx]}:${MINUTE_VALUES[minuteIdx]}`;
}

export function isTimeAfter(start: string, end: string): boolean {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em > sh * 60 + sm;
}

/**
 * Normalise any TimeOnly.ToString() output to "HH:mm".
 * Handles: "09:00", "9:00", "09:00:00", "9:00:00 AM", "9:00 AM", etc.
 */
export function normalizeTime(raw: string): string {
  const cleaned = raw.trim().replace(/\s*(AM|PM)$/i, "");
  const parts = cleaned.split(":");
  const h = parseInt(parts[0] ?? "0", 10);
  const m = parseInt(parts[1] ?? "0", 10);
  const isPM = /PM/i.test(raw);
  const hour24 = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
  return `${String(hour24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function mergeWithAllDays(
  serverDays: RawAvailabilityDayDto[],
): AvailabilityDayDto[] {
  return [0, 1, 2, 3, 4, 5, 6].map((dow) => {
    const existing = serverDays.find((d) => {
      const num = DAY_NAME_TO_NUMBER[d.dayOfWeek] ?? -1;
      return num === dow;
    });
    if (!existing)
      return { dayOfWeek: dow, isActive: false, availabilitySlots: [] };
    return {
      ...existing,
      dayOfWeek: dow,
      availabilitySlots: existing.availabilitySlots.map((s) => ({
        ...s,
        startTime: normalizeTime(s.startTime),
        endTime: normalizeTime(s.endTime),
      })),
    };
  });
}
