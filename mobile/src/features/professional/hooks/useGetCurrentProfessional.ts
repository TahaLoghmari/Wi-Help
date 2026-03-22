import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

export interface ProfessionalSelfDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
}

function getCurrentProfessional() {
  return api.get<ProfessionalSelfDto>(
    API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
  );
}

export function useGetCurrentProfessional() {
  return useQuery<ProfessionalSelfDto>({
    queryKey: ["currentProfessional"],
    queryFn: getCurrentProfessional,
    retry: false,
  });
}
