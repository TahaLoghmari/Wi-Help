import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type { GetAllPatientsDto, PaginationResultDto } from "@/features/admin";

export interface GetAllPatientsRequest {
  page: number;
  pageSize: number;
}

const getAllPatients = (request: GetAllPatientsRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<GetAllPatientsDto>>(
    `${API_ENDPOINTS.PATIENTS.GET_ALL_AS_ADMIN}?${queryString}`,
  );
};

export function GetAllPatients() {
  return useInfiniteQuery<PaginationResultDto<GetAllPatientsDto>>({
    queryKey: ["admin-patients"],
    queryFn: ({ pageParam = 1 }) =>
      getAllPatients({
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
