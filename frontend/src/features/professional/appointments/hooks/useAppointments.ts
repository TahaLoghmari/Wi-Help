import { useInfiniteQuery } from "@tanstack/react-query";
import type { AppointmentDto, PagedResponse } from "../types";
import { request } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

interface UseAppointmentsOptions {
  pageSize?: number;
}

const getAppointments = (page: number, pageSize: number) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return request<PagedResponse<AppointmentDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_ALL}?${queryParams.toString()}`,
  );
};

export function useAppointments({ pageSize = 5 }: UseAppointmentsOptions = {}) {
  return useInfiniteQuery<PagedResponse<AppointmentDto>>({
    queryKey: ["appointments", pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getAppointments(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
  });
}
