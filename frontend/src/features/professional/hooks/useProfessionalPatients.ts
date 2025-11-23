import { useQuery } from "@tanstack/react-query";
import { type PatientDto } from "@/features/patient/types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getProfessionalPatients = () => {
  return api.get<PatientDto[]>(API_ENDPOINTS.APPOINTMENTS.MY_PATIENTS);
};

export function useProfessionalPatients(enabled: boolean = true) {
  return useQuery<PatientDto[]>({
    queryKey: ["professionalPatients"],
    queryFn: getProfessionalPatients,
    enabled,
  });
}
