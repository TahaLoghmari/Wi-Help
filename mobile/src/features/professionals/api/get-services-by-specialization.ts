import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { PROFESSIONAL_ENDPOINTS } from "@/features/professionals/api/endpoints";
import { professionalKeys } from "./keys";
import type { ServiceDto } from "./contracts";

const getServicesBySpecialization = (specializationId: string) => {
  return api.get<ServiceDto[]>(
    PROFESSIONAL_ENDPOINTS.GET_SERVICES_BY_SPECIALIZATION(
      specializationId,
    ),
  );
};

export function useGetServicesBySpecialization(specializationId?: string) {
  return useQuery<ServiceDto[]>({
    queryKey: professionalKeys.services(specializationId!),
    queryFn: () => getServicesBySpecialization(specializationId!),
    enabled: !!specializationId,
    staleTime: 1000 * 60 * 60,
  });
}
