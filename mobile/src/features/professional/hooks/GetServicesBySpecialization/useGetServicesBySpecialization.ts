import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { ServiceDto } from "./ServiceDto";

const getServicesBySpecialization = (specializationId: string) => {
  return api.get<ServiceDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_SERVICES_BY_SPECIALIZATION(specializationId),
  );
};

export function useGetServicesBySpecialization(specializationId?: string) {
  return useQuery<ServiceDto[]>({
    queryKey: ["services", specializationId],
    queryFn: () => getServicesBySpecialization(specializationId!),
    enabled: !!specializationId,
    staleTime: 1000 * 60 * 60,
  });
}
