import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toQueryString } from "@/lib";
import type {
  PrescriptionAdminDto,
  PaginationResultDto,
} from "@/features/admin";

export interface GetAllPrescriptionsForAdminRequest {
  page: number;
  pageSize: number;
}

const getAllPrescriptionsForAdmin = (
  request: GetAllPrescriptionsForAdminRequest,
) => {
  const queryString = toQueryString(request);
  return api.get<PaginationResultDto<PrescriptionAdminDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PRESCRIPTIONS_AS_ADMIN}?${queryString}`,
  );
};

export function useGetAllPrescriptionsForAdmin() {
  return useInfiniteQuery<PaginationResultDto<PrescriptionAdminDto>>({
    queryKey: ["admin-prescriptions"],
    queryFn: ({ pageParam = 1 }) =>
      getAllPrescriptionsForAdmin({
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
