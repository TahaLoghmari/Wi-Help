import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/shared/api/enums.types";

const getAllergies = () => {
  return api.get<LookupDto[]>(PATIENT_ENDPOINTS.GET_ALLERGIES);
};

export function useGetAllergies() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.allergies,
    queryFn: getAllergies,
    staleTime: 1000 * 60 * 60,
  });
}
