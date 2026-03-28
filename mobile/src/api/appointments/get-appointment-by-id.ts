import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { appointmentKeys } from "./keys";
import { type AppointmentDto } from "@/features/appointments/types/api.types";

export function useGetAppointmentById(id: string) {
  return useQuery<AppointmentDto>({
    queryKey: appointmentKeys.detail(id),
    queryFn: () =>
      api.get<AppointmentDto>(
        API_ENDPOINTS.APPOINTMENTS.GET_APPOINTMENT_BY_ID(id),
      ),
    enabled: !!id,
  });
}
