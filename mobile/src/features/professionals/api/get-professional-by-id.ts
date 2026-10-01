import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { type FullProfessionalDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalById(id: string) {
  return api.get<FullProfessionalDto>(
    PROFESSIONAL_ENDPOINTS.GET_PROFESSIONAL_BY_ID(id),
  );
}

export function useGetProfessionalById(id: string | undefined) {
  return useQuery<FullProfessionalDto>({
    queryKey: professionalKeys.detail(id),
    queryFn: () => getProfessionalById(id!),
    enabled: Boolean(id),
  });
}
