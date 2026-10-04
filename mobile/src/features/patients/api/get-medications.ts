import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import type { LookupDto } from "@/shared/api/enums.types";

const getMedications = () => {
  return api.get<LookupDto[]>(PATIENT_ENDPOINTS.GET_MEDICATIONS);
};

export function useGetMedications() {
  return useQuery<LookupDto[]>({
    queryKey: patientKeys.medications,
    queryFn: getMedications,
    staleTime: 1000 * 60 * 60,
  });
}
