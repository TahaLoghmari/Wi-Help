import { useQuery } from "@tanstack/react-query";
import { api } from "@/index";
import { API_ENDPOINTS } from "@/config";
import type { GetScheduleDto } from "@/features/professional";

export const getSchedule = () => {
  return api.get<GetScheduleDto>(API_ENDPOINTS.PROFESSIONALS.GET_SCHEDULE);
};

export function GetSchedule() {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: getSchedule,
  });
}
