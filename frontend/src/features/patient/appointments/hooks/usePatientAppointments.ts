import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  AppointmentDto,
  PagedResponse,
} from "@/features/professional/appointments/types";
import { request } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";

interface UsePatientAppointmentsOptions {
  patientId: string;
  pageSize?: number;
}

const getPatientAppointments = (
  patientId: string,
  page: number,
  pageSize: number,
) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  return request<PagedResponse<AppointmentDto>>(
    `${API_ENDPOINTS.APPOINTMENTS.GET_PATIENT_APPOINTMENTS(patientId)}?${queryParams.toString()}`,
  );
};

export function usePatientAppointments({
  patientId,
  pageSize = 5,
}: UsePatientAppointmentsOptions) {
  return useInfiniteQuery<PagedResponse<AppointmentDto>>({
    queryKey: ["patient-appointments", patientId, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      getPatientAppointments(patientId, pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    enabled: !!patientId,
  });
}
