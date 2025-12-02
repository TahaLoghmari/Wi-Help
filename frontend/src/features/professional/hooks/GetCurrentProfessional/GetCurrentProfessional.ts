import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetCurrentProfessionalDto } from "@/features/professional";

const getCurrentProfessional = () => {
  return api.get<GetCurrentProfessionalDto>(
    API_ENDPOINTS.PROFESSIONALS.CURRENT_PROFESSIONAL,
  );
};

interface GetCurrentProfessionalOptions {
  enabled?: boolean;
}

export function GetCurrentProfessional(
  options: GetCurrentProfessionalOptions = {},
) {
  const { enabled = true } = options;
  return useQuery<GetCurrentProfessionalDto>({
    queryKey: ["currentProfessional"],
    queryFn: getCurrentProfessional,
    enabled,
  });
}
