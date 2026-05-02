import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type FullProfessionalDto } from "@/features/professionals/types/profile.types";

function getProfessionalById(id: string) {
  return api.get<FullProfessionalDto>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID(id),
  );
}

export function useGetProfessionalById(id: string | undefined) {
  return useQuery<FullProfessionalDto>({
    queryKey: ["professional", id],
    queryFn: () => getProfessionalById(id!),
    enabled: Boolean(id),
  });
}
