import type { DailyAvailabilityResponse } from "@/features/patient";

export interface GetProfessionalAvailabilityDto {
  year: number;
  month: number;
  days: DailyAvailabilityResponse[];
}
