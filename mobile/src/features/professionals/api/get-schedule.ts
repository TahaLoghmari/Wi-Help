import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { professionalKeys } from "./keys";
import { type GetScheduleDto } from "./contracts";

function getSchedule(professionalId: string) {
  return api.get<GetScheduleDto>(
    PROFESSIONAL_ENDPOINTS.GET_SCHEDULE(professionalId),
  );
}

export function useGetSchedule(professionalId?: string) {
  return useQuery<GetScheduleDto>({
    queryKey: professionalKeys.schedule(professionalId!),
    queryFn: () => getSchedule(professionalId!),
    enabled: Boolean(professionalId),
  });
}
