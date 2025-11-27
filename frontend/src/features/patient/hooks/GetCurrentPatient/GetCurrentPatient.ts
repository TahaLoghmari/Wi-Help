import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetCurrentPatientDto } from "@/features/patient";

const getCurrentPatient = () => {
  return api.get<GetCurrentPatientDto>(API_ENDPOINTS.PATIENTS.CURRENT_PATIENT);
};

export function GetCurrentPatient() {
  return useQuery<GetCurrentPatientDto>({
    queryKey: ["currentPatient"],
    queryFn: getCurrentPatient,
  });
}
