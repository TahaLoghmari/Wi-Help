import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { ProblemDetailsDto } from "@/shared/api/enums.types";
import type { AvailabilityDayDto } from "./contracts";
import { professionalKeys } from "./keys";

const DAY_NUMBER_TO_NAME = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function useSetupSchedule() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, AvailabilityDayDto[]>({
    mutationFn: (days) =>
      api.post<void>(PROFESSIONAL_ENDPOINTS.SETUP_SCHEDULE, {
        dayAvailabilities: days.map((day) => ({
          ...day,
          dayOfWeek: DAY_NUMBER_TO_NAME[day.dayOfWeek],
        })),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: professionalKeys.scheduleAll,
      });
      void queryClient.invalidateQueries({
        queryKey: professionalKeys.availability,
      });
    },
  });
}
