import { mergeWithAllDays } from "@/features/professionals/lib/utils";
import type {
  AvailabilityDayDto,
  RawAvailabilityDayDto,
} from "@/entities/professional";

export interface ScheduleDraftState {
  professionalId: string | null;
  days: AvailabilityDayDto[];
  savedDays: AvailabilityDayDto[];
}

export type ScheduleDraftAction =
  | {
      type: "serverLoaded";
      professionalId: string;
      days: RawAvailabilityDayDto[];
    }
  | { type: "dayToggled"; dayOfWeek: number }
  | {
      type: "slotAdded";
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }
  | {
      type: "slotEdited";
      dayOfWeek: number;
      slotIndex: number;
      startTime: string;
      endTime: string;
    }
  | { type: "slotDeleted"; dayOfWeek: number; slotIndex: number }
  | { type: "saveSucceeded"; submittedDays: AvailabilityDayDto[] };

export function createInitialScheduleDraft(): ScheduleDraftState {
  const days = mergeWithAllDays([]);
  return { professionalId: null, days, savedDays: days };
}

export function isScheduleDraftDirty(state: ScheduleDraftState): boolean {
  const normalize = (days: AvailabilityDayDto[]) =>
    days.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      isActive: day.isActive,
      availabilitySlots: day.isActive ? day.availabilitySlots : [],
    }));

  return (
    JSON.stringify(normalize(state.days)) !==
    JSON.stringify(normalize(state.savedDays))
  );
}

export function scheduleDraftReducer(
  state: ScheduleDraftState,
  action: ScheduleDraftAction,
): ScheduleDraftState {
  if (action.type === "serverLoaded") {
    const serverDays = mergeWithAllDays(action.days);
    const preserveDraft =
      state.professionalId === action.professionalId &&
      isScheduleDraftDirty(state);

    return {
      professionalId: action.professionalId,
      days: preserveDraft ? state.days : serverDays,
      savedDays: serverDays,
    };
  }

  if (action.type === "saveSucceeded") {
    return { ...state, savedDays: action.submittedDays };
  }

  const dayIndex = state.days.findIndex(
    (day) => day.dayOfWeek === action.dayOfWeek,
  );
  if (dayIndex === -1) return state;

  const day = state.days[dayIndex];
  if (!day) return state;

  let updatedDay: AvailabilityDayDto;

  if (action.type === "dayToggled") {
    const isActive = !day.isActive;
    updatedDay = {
      ...day,
      isActive,
      availabilitySlots:
        isActive && day.availabilitySlots.length === 0
          ? [{ startTime: "09:00", endTime: "10:00" }]
          : day.availabilitySlots,
    };
  } else if (action.type === "slotAdded") {
    updatedDay = {
      ...day,
      availabilitySlots: [
        ...day.availabilitySlots,
        { startTime: action.startTime, endTime: action.endTime },
      ],
    };
  } else {
    if (
      !Number.isInteger(action.slotIndex) ||
      action.slotIndex < 0 ||
      action.slotIndex >= day.availabilitySlots.length
    ) {
      return state;
    }

    if (action.type === "slotDeleted") {
      updatedDay = {
        ...day,
        availabilitySlots: day.availabilitySlots.filter(
          (_, index) => index !== action.slotIndex,
        ),
      };
    } else {
      const availabilitySlots = [...day.availabilitySlots];
      availabilitySlots[action.slotIndex] = {
        ...availabilitySlots[action.slotIndex],
        startTime: action.startTime,
        endTime: action.endTime,
      };
      updatedDay = { ...day, availabilitySlots };
    }
  }

  const days = [...state.days];
  days[dayIndex] = updatedDay;
  return { ...state, days };
}
