import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "../LookupDto";

const getConditions = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_CONDITIONS);
};

export function useGetConditions() {
  return useQuery<LookupDto[]>({
    queryKey: ["conditions"],
    queryFn: getConditions,
    staleTime: 1000 * 60 * 60,
  });
}
