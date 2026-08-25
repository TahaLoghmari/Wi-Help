import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import type { ProblemDetailsDto } from "@/types/enums.types";
import type { RespondToAppointmentDto } from "./contracts";
import { appointmentKeys } from "./keys";

export function useRespondToAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, RespondToAppointmentDto>({
    mutationFn: ({ appointmentId, isAccepted }) =>
      api.post<void>(
        API_ENDPOINTS.APPOINTMENTS.RESPOND_TO_APPOINTMENT(appointmentId),
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
