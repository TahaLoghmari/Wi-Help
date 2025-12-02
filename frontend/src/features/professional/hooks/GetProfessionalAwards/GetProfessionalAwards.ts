import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetAwardsDto } from "../GetAwards";

export interface GetProfessionalAwardsRequest {
  professionalId: string;
}

const getProfessionalAwards = (request: GetProfessionalAwardsRequest) => {
  return api.get<GetAwardsDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_AWARDS(request.professionalId),
  );
};

export function useGetProfessionalAwards(
  request: GetProfessionalAwardsRequest,
) {
  return useQuery<GetAwardsDto[]>({
    queryKey: ["professionalAwards", request.professionalId],
    queryFn: () => getProfessionalAwards(request),
    enabled: !!request.professionalId,
  });
}
