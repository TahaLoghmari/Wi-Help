import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { type ProfessionalAwardDto } from "./contracts";
import { professionalKeys } from "./keys";

function getProfessionalAwards(professionalId: string) {
  return api.get<ProfessionalAwardDto[]>(
    PROFESSIONAL_ENDPOINTS.GET_PROFESSIONAL_AWARDS(professionalId),
  );
}

export function useGetProfessionalAwards(professionalId: string | undefined) {
  return useQuery<ProfessionalAwardDto[]>({
    queryKey: professionalKeys.awardsByProfessional(professionalId),
    queryFn: () => getProfessionalAwards(professionalId!),
    enabled: Boolean(professionalId),
  });
}
