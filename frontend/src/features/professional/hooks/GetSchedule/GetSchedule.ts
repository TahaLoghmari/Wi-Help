import { useQuery } from "@tanstack/react-query";
import { api } from "@/index";
import { API_ENDPOINTS } from "@/config";
import type { GetScheduleDto } from "@/features/professional";

export const getSchedule = (professionalId: string) => {
  return api.get<GetScheduleDto>(
    API_ENDPOINTS.PROFESSIONALS.GET_SCHEDULE(professionalId),
  );
};

export function GetSchedule(professionalId: string) {
  return useQuery({
    queryKey: ["schedule", professionalId],
    queryFn: () => getSchedule(professionalId),
  });
}
