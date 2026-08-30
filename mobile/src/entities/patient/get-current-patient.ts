import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { patientKeys } from "./keys";
import { type FullPatientDto } from "./contracts";

function getCurrentPatient() {
  return api.get<FullPatientDto>(API_ENDPOINTS.PATIENTS.CURRENT_PATIENT);
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
