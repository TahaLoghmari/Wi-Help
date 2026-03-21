import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { SpecializationDto } from "./SpecializationDto";

const getSpecializationsFromApi = () => {
  return api.get<SpecializationDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_SPECIALIZATIONS,
  );
};

export function GetSpecializations() {
  return useQuery<SpecializationDto[]>({
    queryKey: ["specializations"],
    queryFn: getSpecializationsFromApi,
    staleTime: 1000 * 60 * 60,
  });
}
