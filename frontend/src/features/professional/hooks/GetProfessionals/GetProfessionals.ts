import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import { useProfessionalFiltersStore } from "@/features/patient";
import { toQueryString } from "@/lib";
import type { PaginationResultDto } from "@/types";
import type {
  GetProfessionalsRequest,
  GetProfessionalsDto,
} from "@/features/professional";

const getProfessionals = (request: GetProfessionalsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetProfessionalsDto>>(
    `${API_ENDPOINTS.PROFESSIONALS.GET_ALL_PROFESSIONALS}?${queryString}`,
  );
};

export function GetProfessionals() {
  const { search, location, maxPrice } = useProfessionalFiltersStore();

  return useInfiniteQuery<PaginationResultDto<GetProfessionalsDto>>({
    queryKey: ["professionals", search, location, maxPrice],
    queryFn: ({ pageParam = 1 }) =>
      getProfessionals({
        page: pageParam as number,
        pageSize: 8,
        search,
        location,
        maxPrice,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
