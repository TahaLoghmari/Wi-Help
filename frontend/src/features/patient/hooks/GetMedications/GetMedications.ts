import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { LookupDto } from "../LookupDto";

const getMedicationsFromApi = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_MEDICATIONS);
};

export function GetMedications() {
  return useQuery<LookupDto[]>({
    queryKey: ["medications"],
    queryFn: getMedicationsFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
