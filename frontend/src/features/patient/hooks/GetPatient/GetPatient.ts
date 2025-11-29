import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetPatientDto, GetPatientRequest } from "@/features/patient";

const getPatient = (request: GetPatientRequest) => {
  return api.get<GetPatientDto>(
    API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_ID(request.patientId),
  );
};

export function GetPatient(request: GetPatientRequest) {
  return useQuery<GetPatientDto>({
    queryKey: ["patient", request.patientId],
    queryFn: () => getPatient(request),
  });
}
