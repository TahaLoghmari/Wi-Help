import { useQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

export interface CountryDto {
  id: string;
  key: string;
}

const getCountries = () => {
  return api.get<CountryDto[]>(API_ENDPOINTS.AUTH.GET_COUNTRIES);
};

export function useGetCountries() {
  return useQuery<CountryDto[]>({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 1000 * 60 * 60,
  });
}
