import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import type { ProblemDetailsDto } from "@/types/enums.types";
import { appointmentKeys } from "./keys";

export function useCancelAppointmentByProfessional() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: (appointmentId) =>
      api.post<void>(
        API_ENDPOINTS.APPOINTMENTS.CANCEL_APPOINTMENT_BY_PROFESSIONAL(
          appointmentId,
        ),
        {},
      ),
    onSuccess: (_, appointmentId) => {
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(appointmentId),
      });
    },
  });
}
