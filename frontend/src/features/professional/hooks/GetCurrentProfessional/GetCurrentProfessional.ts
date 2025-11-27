import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetCurrentProfessionalDto } from "@/features/professional";

const getCurrentProfessional = () => {
  return api.get<GetCurrentProfessionalDto>(
    API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
  );
};

export function GetCurrentProfessional() {
  return useQuery<GetCurrentProfessionalDto>({
    queryKey: ["currentProfessional"],
    queryFn: getCurrentProfessional,
  });
}
