import { useQuery } from "@tanstack/react-query";
import { type ProfessionalDto } from "../types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getCurrentProfessional = () => {
  return api.get<ProfessionalDto>(
    API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
  );
};

export function useCurrentProfessional(enabled: boolean = true) {
  return useQuery<ProfessionalDto>({
    queryKey: ["currentProfessional"],
    queryFn: getCurrentProfessional,
    enabled,
  });
}
