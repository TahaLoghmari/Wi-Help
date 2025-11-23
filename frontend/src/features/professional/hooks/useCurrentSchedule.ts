import { useQuery } from "@tanstack/react-query";
import { api } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type ScheduleDto } from "@/features/professional";

export const getSchedule = () => {
    return api.get<ScheduleDto>(API_ENDPOINTS.PROFESSIONALS.GET_SCHEDULE);
};

export function useCurrentSchedule() {
    return useQuery({
        queryKey: ["schedule"],
        queryFn: getSchedule,
    });
}
