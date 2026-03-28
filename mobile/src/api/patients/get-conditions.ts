import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/types/enums.types";

const getConditions = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_CONDITIONS);
};

export function useGetConditions() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.conditions,
    queryFn: getConditions,
    staleTime: 1000 * 60 * 60,
  });
}
