import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { type RespondToAppointmentDto } from "@/features/appointments/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { appointmentKeys } from "./keys";
import { notificationKeys } from "@/api/notifications/keys";

function respondToAppointment({
  appointmentId,
  isAccepted,
}: RespondToAppointmentDto) {
  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.RESPOND_TO_APPOINTMENT(appointmentId),
    { isAccepted },
  );
}

export function useRespondToAppointment() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<void, ProblemDetailsDto, RespondToAppointmentDto>({
    mutationFn: respondToAppointment,
    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: variables.isAccepted
          ? "Appointment accepted"
          : "Appointment declined",
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.all,
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onError: handleApiError,
  });
}
