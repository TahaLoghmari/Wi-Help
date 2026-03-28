import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { professionalKeys } from "./keys";
import type { ServiceDto } from "@/features/professionals/types/api.types";

const getServicesBySpecialization = (specializationId: string) => {
  return api.get<ServiceDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_SERVICES_BY_SPECIALIZATION(
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
