import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/types/enums.types";

const getAllergies = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_ALLERGIES);
};

export function useGetAllergies() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.allergies,
    queryFn: getAllergies,
    staleTime: 1000 * 60 * 60,
  });
}
