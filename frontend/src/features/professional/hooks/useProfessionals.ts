import { useQuery } from "@tanstack/react-query";
import {
  type ProfessionalDto,
  type ProfessionalsQueryParametersDto,
} from "@/features/professional";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";
import { useProfessionalFiltersStore } from "@/features/patient/stores/useProfessionalFiltersStore";
import { toQueryString } from "@/lib/utils";

const getProfessionals = (filters: ProfessionalsQueryParametersDto) => {
  const queryString = toQueryString(filters);
  const url = queryString
    ? `${API_ENDPOINTS.PROFESSIONALS.GET_ALL_PROFESSIONALS}?${queryString}`
    : API_ENDPOINTS.PROFESSIONALS.GET_ALL_PROFESSIONALS;

  return api.get<ProfessionalDto[]>(url);
};

export function useProfessionals() {
  const { search, location, maxPrice } = useProfessionalFiltersStore();

  const filters: ProfessionalsQueryParametersDto = {
    search,
    location,
    maxPrice,
  };

  return useQuery<ProfessionalDto[]>({
    queryKey: ["professionals", filters],
    queryFn: () => getProfessionals(filters),
  });
}
