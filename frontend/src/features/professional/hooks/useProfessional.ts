import { useQuery } from "@tanstack/react-query";
import { type ProfessionalDto } from "@/features/professional/types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getProfessional = (id: string) => {
  return api.get<ProfessionalDto>(
    `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID}/${id}`,
  );
};

export function useProfessional(id: string, enabled: boolean = true) {
  return useQuery<ProfessionalDto>({
    queryKey: ["professional", id],
    queryFn: () => getProfessional(id),
    enabled: !!id && enabled,
  });
}
