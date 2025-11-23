import { useQuery } from "@tanstack/react-query";
import { type PatientDto } from "../types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getPatient = (id: string) => {
  return api.get<PatientDto>(API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_ID(id));
};

export function usePatient(id: string, enabled: boolean = true) {
  return useQuery<PatientDto>({
    queryKey: ["patient", id],
    queryFn: () => getPatient(id),
    enabled: !!id && enabled,
  });
}
