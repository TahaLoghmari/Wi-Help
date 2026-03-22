import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LookupDto } from "../LookupDto";

const getAllergies = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_ALLERGIES);
};

export function useGetAllergies() {
  return useQuery<LookupDto[]>({
    queryKey: ["allergies"],
    queryFn: getAllergies,
    staleTime: 1000 * 60 * 60,
  });
}
