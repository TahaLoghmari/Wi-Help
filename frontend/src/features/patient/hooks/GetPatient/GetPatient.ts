import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetPatientDto, GetPatientRequest } from "@/features/patient";

const getPatient = (request: GetPatientRequest) => {
  const params = new URLSearchParams();
  if (request.requesterLatitude !== undefined) {
    params.append("requesterLatitude", request.requesterLatitude.toString());
  }
  if (request.requesterLongitude !== undefined) {
    params.append("requesterLongitude", request.requesterLongitude.toString());
  }
  const queryString = params.toString();
  const url = `${API_ENDPOINTS.PATIENTS.GET_PATIENT_BY_ID(request.patientId)}${queryString ? `?${queryString}` : ""}`;
  return api.get<GetPatientDto>(url);
};

export function GetPatient(request: GetPatientRequest) {
  return useQuery<GetPatientDto>({
    queryKey: [
      "patient",
      request.patientId,
      request.requesterLatitude,
      request.requesterLongitude,
    ],
    queryFn: () => getPatient(request),
  });
}
