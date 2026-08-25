import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { type FullProfessionalDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalById(id: string) {
  return api.get<FullProfessionalDto>(
    API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID(id),
  );
}

export function useGetProfessionalById(id: string | undefined) {
  return useQuery<FullProfessionalDto>({
    queryKey: professionalKeys.detail(id),
    queryFn: () => getProfessionalById(id!),
    enabled: Boolean(id),
  });
}
