import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetExperiencesDto } from "../GetExperiences";

export interface GetProfessionalExperiencesRequest {
  professionalId: string;
}

const getProfessionalExperiences = (
  request: GetProfessionalExperiencesRequest,
) => {
  return api.get<GetExperiencesDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_EXPERIENCES(
      request.professionalId,
    ),
  );
};

export function useGetProfessionalExperiences(
  request: GetProfessionalExperiencesRequest,
) {
  return useQuery<GetExperiencesDto[]>({
    queryKey: ["professionalExperiences", request.professionalId],
    queryFn: () => getProfessionalExperiences(request),
    enabled: !!request.professionalId,
  });
}
