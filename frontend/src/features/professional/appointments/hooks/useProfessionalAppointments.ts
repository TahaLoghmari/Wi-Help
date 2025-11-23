import { useInfiniteQuery } from "@tanstack/react-query";
import type { AppointmentDto, PagedResponse } from "../types";
import { request } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

interface UseProfessionalAppointmentsOptions {
  professionalId: string;
  pageSize?: number;
}

const getProfessionalAppointments = (
  professionalId: string,
  page: number,
  pageSize: number,
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return request<PagedResponse<AppointmentDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PROFESSIONAL_APPOINTMENTS(professionalId)}?${queryParams.toString()}`,
  );
};

export function useProfessionalAppointments({
  professionalId,
  pageSize = 5,
}: UseProfessionalAppointmentsOptions) {
  return useInfiniteQuery<PagedResponse<AppointmentDto>>({
    queryKey: ["professional-appointments", professionalId, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalAppointments(
        professionalId,
        pageParam as number,
        pageSize,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!professionalId,
  });
}
