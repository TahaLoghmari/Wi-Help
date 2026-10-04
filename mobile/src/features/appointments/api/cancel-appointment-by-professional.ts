import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { ProblemDetailsDto } from "@/shared/api/enums.types";
import { appointmentKeys } from "./keys";

export function useCancelAppointmentByProfessional() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: (appointmentId) =>
      api.post<void>(
        APPOINTMENT_ENDPOINTS.CANCEL_APPOINTMENT_BY_PROFESSIONAL(
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
