import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type {
  GetProfessionalRequest,
  GetProfessionalDto,
} from "@/features/professional";

const getProfessional = (request: GetProfessionalRequest) => {
  return api.get<GetProfessionalDto>(
    `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID(request.professionalId)}`,
  );
};

export function GetProfessional(request: GetProfessionalRequest) {
  return useQuery<GetProfessionalDto>({
    queryKey: ["professional", request.professionalId],
    queryFn: () => getProfessional(request),
  });
}
