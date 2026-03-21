import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { LookupDto } from "../LookupDto";

const getConditionsFromApi = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_CONDITIONS);
};

export function GetConditions() {
  return useQuery<LookupDto[]>({
    queryKey: ["conditions"],
    queryFn: getConditionsFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
