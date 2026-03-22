import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { type AvailabilityDayDto } from "@/features/professional/types/schedule.types";
import { type ProblemDetailsDto } from "@/types/enums.types";

// C# DayOfWeek enum values serialised as strings via JsonStringEnumConverter.
// Index matches the numeric DayOfWeek: 0 = Sunday … 6 = Saturday.
const DAY_NUMBER_TO_NAME = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function setupSchedule(days: AvailabilityDayDto[]) {
  return api.post<void>(API_ENDPOINTS.PROFESSIONALS.SETUP_SCHEDULE, {
    dayAvailabilities: days.map((day) => ({
      ...day,
      dayOfWeek: DAY_NUMBER_TO_NAME[day.dayOfWeek],
    })),
  });
}

export function useSetupSchedule() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<void, ProblemDetailsDto, AvailabilityDayDto[]>({
    mutationFn: setupSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({
        queryKey: ["professionalAvailability"],
      });
      Toast.show({ type: "success", text1: "Schedule saved successfully" });
    },
    onError: handleApiError,
  });
}
