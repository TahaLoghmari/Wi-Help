import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api/endpoints";
import { type PaginationResultDto } from "@/shared/api/enums.types";

import { type AppointmentDto } from "./contracts";
import { appointmentKeys } from "./keys";

function getProfessionalAppointments(page: number) {
  return api.get<PaginationResultDto<AppointmentDto>>(
    `${APPOINTMENT_ENDPOINTS.GET_PROFESSIONAL_APPOINTMENTS}?page=${page}&pageSize=20`,
  );
}

export function useGetProfessionalAppointments() {
  return useInfiniteQuery<PaginationResultDto<AppointmentDto>>({
    queryKey: appointmentKeys.professionalList(),
    queryFn: ({ pageParam = 1 }) =>
      getProfessionalAppointments(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNextPage ? pages.length + 1 : undefined,
  });
}
