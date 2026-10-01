import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { ProblemDetailsDto } from "@/shared/api/enums.types";
import type { RespondToAppointmentDto } from "./contracts";
import { appointmentKeys } from "./keys";

export function useRespondToAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, RespondToAppointmentDto>({
    mutationFn: ({ appointmentId, isAccepted }) =>
      api.post<void>(
        APPOINTMENT_ENDPOINTS.RESPOND_TO_APPOINTMENT(appointmentId),
        { isAccepted },
      ),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.appointmentId),
      });
    },
  });
}
