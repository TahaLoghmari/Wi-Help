import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { SpecializationDto } from "./SpecializationDto";

const getSpecializations = () => {
  return api.get<SpecializationDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_SPECIALIZATIONS,
  );
};

export function useGetSpecializations() {
  return useQuery<SpecializationDto[]>({
    queryKey: ["specializations"],
    queryFn: getSpecializations,
    staleTime: 1000 * 60 * 60,
  });
}
