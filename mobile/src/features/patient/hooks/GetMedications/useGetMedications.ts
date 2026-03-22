import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "../LookupDto";

const getMedications = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_MEDICATIONS);
};

export function useGetMedications() {
  return useQuery<LookupDto[]>({
    queryKey: ["medications"],
    queryFn: getMedications,
    staleTime: 1000 * 60 * 60,
  });
}
