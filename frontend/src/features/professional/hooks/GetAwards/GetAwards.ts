import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetAwardsDto } from "./GetAwardsDto";

const getAwards = () => {
  return api.get<GetAwardsDto[]>(API_ENDPOINTS.PROFESSIONALS.GET_AWARDS);
};

export function useGetAwards() {
  return useQuery<GetAwardsDto[]>({
    queryKey: ["awards"],
    queryFn: getAwards,
  });
}
