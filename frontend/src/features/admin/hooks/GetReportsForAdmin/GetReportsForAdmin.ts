import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type {
  PaginationResultDto,
  ReportAdminDto,
} from "@/features/admin/types/adminTypes";

export interface GetReportsForAdminRequest {
  page: number;
  pageSize: number;
  type?: "Patient" | "Professional";
}

const getReportsForAdmin = (request: GetReportsForAdminRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<ReportAdminDto>>(
    `${API_ENDPOINTS.REPORTS.GET_ALL_AS_ADMIN}?${queryString}`,
  );
};

export function useGetReportsForAdmin(type?: "Patient" | "Professional") {
  return useInfiniteQuery<PaginationResultDto<ReportAdminDto>>({
    queryKey: ["admin-reports", type],
    queryFn: ({ pageParam = 1 }) =>
      getReportsForAdmin({
        page: pageParam as number,
        pageSize: 10,
        type,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const hasNextPage =
        lastPage.totalCount > pages.length * lastPage.pageSize;
      return hasNextPage ? pages.length + 1 : undefined;
    },
  });
}
