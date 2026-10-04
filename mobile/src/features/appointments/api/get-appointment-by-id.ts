import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/api-client";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api/endpoints";

import { type AppointmentDto } from "./contracts";
import { appointmentKeys } from "./keys";

export function useGetAppointmentById(id: string) {
  return useQuery<AppointmentDto>({
    queryKey: appointmentKeys.detail(id),
    queryFn: () =>
      api.get<AppointmentDto>(
        APPOINTMENT_ENDPOINTS.GET_APPOINTMENT_BY_ID(id),
      ),
    enabled: !!id,
  });
}
