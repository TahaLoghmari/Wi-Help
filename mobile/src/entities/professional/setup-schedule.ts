import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import type { ProblemDetailsDto } from "@/types/enums.types";
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
      api.post<void>(API_ENDPOINTS.PROFESSIONALS.SETUP_SCHEDULE, {
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
