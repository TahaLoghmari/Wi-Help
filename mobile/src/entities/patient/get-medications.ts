import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/types/enums.types";

const getMedications = () => {
  return api.get<LookupDto[]>(API_ENDPOINTS.PATIENTS.GET_MEDICATIONS);
};

export function useGetMedications() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.medications,
    queryFn: getMedications,
    staleTime: 1000 * 60 * 60,
  });
}
