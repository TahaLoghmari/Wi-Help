export interface AvailabilitySlotDto {
  id?: string | null;
  startTime: string;
  endTime: string;
}

export interface AvailabilityDayDto {
  dayOfWeek: number;
  isActive: boolean;
  availabilitySlots: AvailabilitySlotDto[];
}

export interface RawAvailabilityDayDto {
  dayOfWeek: string;
  isActive: boolean;
  availabilitySlots: AvailabilitySlotDto[];
}

export interface GetScheduleDto {
  days: RawAvailabilityDayDto[];
}
