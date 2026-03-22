import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type GetScheduleDto } from "@/features/professional/types/schedule.types";

function getSchedule(professionalId: string) {
  return api.get<GetScheduleDto>(
    API_ENDPOINTS.PROFESSIONALS.GET_SCHEDULE(professionalId),
  );
}

export function useGetSchedule(professionalId?: string) {
  return useQuery<GetScheduleDto>({
    queryKey: ["schedule", professionalId],
    queryFn: () => getSchedule(professionalId!),
    enabled: Boolean(professionalId),
  });
}
