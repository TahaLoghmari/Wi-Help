import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import { type FullPatientDto } from "@/features/patients/types/api.types";

function getPatientById(id: string) {
  return api.get<FullPatientDto>(API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_ID(id));
}

export function useGetPatientById(id: string | undefined) {
  return useQuery<FullPatientDto>({
    queryKey: id ? patientKeys.patientById(id) : ["patient-disabled"],
    queryFn: () => getPatientById(id!),
    enabled: !!id,
    retry: false,
  });
}
