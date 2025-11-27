import type { DayAvailabilityDto } from "@/features/professional";

export interface SetupScheduleRequest {
  days: DayAvailabilityDto[];
}
