import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

export interface StateDto {
  id: string;
  key: string;
}

const getStatesByCountry = (countryId: string) => {
  return api.get<StateDto[]>(
    API_ENDPOINTS.AUTH.GET_STATES_BY_COUNTRY(countryId),
  );
};

export function useGetStatesByCountry(countryId: string) {
  return useQuery<StateDto[]>({
    queryKey: ["states", countryId],
    queryFn: () => getStatesByCountry(countryId),
    enabled: !!countryId,
    staleTime: 1000 * 60 * 60,
  });
}
