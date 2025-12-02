import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetEducationsDto } from "../GetEducations";

export interface GetProfessionalEducationsRequest {
  professionalId: string;
}

const getProfessionalEducations = (
  request: GetProfessionalEducationsRequest,
) => {
  return api.get<GetEducationsDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_EDUCATIONS(
      request.professionalId,
    ),
  );
};

export function useGetProfessionalEducations(
  request: GetProfessionalEducationsRequest,
) {
  return useQuery<GetEducationsDto[]>({
    queryKey: ["professionalEducations", request.professionalId],
    queryFn: () => getProfessionalEducations(request),
    enabled: !!request.professionalId,
  });
}
