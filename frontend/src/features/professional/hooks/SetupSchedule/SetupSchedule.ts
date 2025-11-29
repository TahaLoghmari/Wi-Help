import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { SetupScheduleRequest } from "@/features/professional";

export const setupSchedule = (request: SetupScheduleRequest) => {
  const body = {
    dayAvailabilities: request.days.map((day) => ({
      dayOfWeek: day.dayOfWeek,
      isActive: day.isActive,
      availabilitySlots: day.availabilitySlots,
    })),
  };
  return api.post<void>(API_ENDPOINTS.PROFESSIONALS.SETUP_SCHEDULE, body);
};

export function SetupSchedule() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, SetupScheduleRequest>({
    mutationFn: setupSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      queryClient.invalidateQueries({ queryKey: ["professionalAvailability"] });
      toast.success("Schedule setup successfully!");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
