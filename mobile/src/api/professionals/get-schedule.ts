import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { professionalKeys } from "./keys";
import { type GetScheduleDto } from "@/features/professionals/types/schedule.types";

function getSchedule(professionalId: string) {
  return api.get<GetScheduleDto>(
    API_ENDPOINTS.PROFESSIONALS.GET_SCHEDULE(professionalId),
  );
}

export function useGetSchedule(professionalId?: string) {
  return useQuery<GetScheduleDto>({
    queryKey: professionalKeys.schedule(professionalId!),
    queryFn: () => getSchedule(professionalId!),
    enabled: Boolean(professionalId),
  });
}
