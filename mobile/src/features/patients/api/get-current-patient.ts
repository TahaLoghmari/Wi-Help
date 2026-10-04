import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PATIENT_ENDPOINTS } from "@/features/patients/api/endpoints";
import { patientKeys } from "./keys";
import { type FullPatientDto } from "./contracts";

function getCurrentPatient() {
  return api.get<FullPatientDto>(PATIENT_ENDPOINTS.CURRENT_PATIENT);
}

export function useGetCurrentPatient(
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<FullPatientDto>({
    queryKey: patientKeys.currentPatient,
    queryFn: getCurrentPatient,
    enabled,
    retry: false,
  });
}
