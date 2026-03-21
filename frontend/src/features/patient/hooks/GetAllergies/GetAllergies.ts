import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { LookupDto } from "../LookupDto";

const getAllergiesFromApi = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_ALLERGIES);
};

export function GetAllergies() {
  return useQuery<LookupDto[]>({
    queryKey: ["allergies"],
    queryFn: getAllergiesFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
