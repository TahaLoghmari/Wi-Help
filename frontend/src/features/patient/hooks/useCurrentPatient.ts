import { useQuery } from "@tanstack/react-query";
import { type PatientDto } from "../types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getCurrentPatient = () => {
  return api.get<PatientDto>(API_ENDPOINTS.PATIENTS.CURRENT_PATIENT);
};

export function useCurrentPatient(enabled: boolean = true) {
  return useQuery<PatientDto>({
    queryKey: ["currentPatient"],
    queryFn: getCurrentPatient,
    enabled,
  });
}
