import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import { type FullPatientDto } from "@/features/patients/types/api.types";

function getCurrentPatient() {
  return api.get<FullPatientDto>(API_ENDPOINTS.PATIENTS.CURRENT_PATIENT);
}

export function useGetCurrentPatient() {
  return useQuery<FullPatientDto>({
    queryKey: patientKeys.currentPatient,
    queryFn: getCurrentPatient,
    retry: false,
  });
}
