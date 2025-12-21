import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type {
  GetProfessionalRequest,
  GetProfessionalDto,
} from "@/features/professional";

const getProfessional = (request: GetProfessionalRequest) => {
  const params = new URLSearchParams();
  if (request.requesterLatitude !== undefined) {
    params.append("requesterLatitude", request.requesterLatitude.toString());
  }
  if (request.requesterLongitude !== undefined) {
    params.append("requesterLongitude", request.requesterLongitude.toString());
  }
  const queryString = params.toString();
  const url = `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID(request.professionalId)}${queryString ? `?${queryString}` : ""}`;
  return api.get<GetProfessionalDto>(url);
};

export function GetProfessional(request: GetProfessionalRequest) {
  return useQuery<GetProfessionalDto>({
    queryKey: [
      "professional",
      request.professionalId,
      request.requesterLatitude,
      request.requesterLongitude,
    ],
    queryFn: () => getProfessional(request),
  });
}
