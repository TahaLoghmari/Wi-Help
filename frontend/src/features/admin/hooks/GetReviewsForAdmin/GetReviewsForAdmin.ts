import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type { ReviewAdminDto, PaginationResultDto } from "@/features/admin";

export interface GetReviewsForAdminRequest {
  page: number;
  pageSize: number;
}

const getReviewsForAdmin = (request: GetReviewsForAdminRequest) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<ReviewAdminDto>>(
    `${API_ENDPOINTS.REVIEWS.GET_ALL_AS_ADMIN}?${queryString}`,
  );
};

export function useGetReviewsForAdmin() {
  return useInfiniteQuery<PaginationResultDto<ReviewAdminDto>>({
    queryKey: ["admin-reviews"],
    queryFn: ({ pageParam = 1 }) =>
      getReviewsForAdmin({
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
