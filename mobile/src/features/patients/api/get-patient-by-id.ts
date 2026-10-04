import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import { type FullPatientDto } from "./contracts";

function getPatientById(id: string) {
  return api.get<FullPatientDto>(PATIENT_ENDPOINTS.GET_PATIENT_BY_ID(id));
}

export function useGetPatientById(id: string | undefined) {
  return useQuery<FullPatientDto>({
    queryKey: id ? patientKeys.patientById(id) : ["patient-disabled"],
    queryFn: () => getPatientById(id!),
    enabled: !!id,
    retry: false,
  });
}
