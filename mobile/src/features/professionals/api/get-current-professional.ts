import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { professionalKeys } from "./keys";
import { type ProfessionalSelfDto } from "./contracts";

function getCurrentProfessional() {
  return api.get<ProfessionalSelfDto>(
    PROFESSIONAL_ENDPOINTS.CURRENT_PROFESSIONAL,
  );
}

export function useGetCurrentProfessional(
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery<ProfessionalSelfDto>({
    queryKey: professionalKeys.currentProfessional,
    queryFn: getCurrentProfessional,
    enabled,
    retry: false,
  });
}
