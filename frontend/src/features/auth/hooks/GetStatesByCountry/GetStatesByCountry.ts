import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { StateDto } from "./StateDto";

const getStatesByCountry = (countryId: string) => {
  return api.get<StateDto[]>(
    API_ENDPOINTS.AUTH.GET_STATES_BY_COUNTRY(countryId),
  );
};

export function GetStatesByCountry(countryId: string) {
  return useQuery<StateDto[]>({
    queryKey: ["states", countryId],
    queryFn: () => getStatesByCountry(countryId),
    staleTime: 1000 * 60 * 60,
    enabled: !!countryId,
  });
}
