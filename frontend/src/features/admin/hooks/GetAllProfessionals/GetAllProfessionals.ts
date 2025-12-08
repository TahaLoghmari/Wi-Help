import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type {
  GetAllProfessionalsDto,
  PaginationResultDto,
} from "@/features/admin";

export interface GetAllProfessionalsRequest {
  page: number;
  pageSize: number;
}

const getAllProfessionals = (request: GetAllProfessionalsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetAllProfessionalsDto>>(
    `${API_ENDPOINTS.PROFESSIONALS.GET_ALL_AS_ADMIN}?${queryString}`,
  );
};

export function GetAllProfessionals() {
  return useInfiniteQuery<PaginationResultDto<GetAllProfessionalsDto>>({
    queryKey: ["admin-professionals"],
    queryFn: ({ pageParam = 1 }) =>
      getAllProfessionals({
        page: pageParam as number,
        pageSize: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage =
        lastPage.totalCount > pages.length * lastPage.pageSize;
      return hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
