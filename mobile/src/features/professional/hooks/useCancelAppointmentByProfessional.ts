import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { type ProblemDetailsDto } from "@/types/enums.types";

function cancelAppointmentByProfessional(appointmentId: string) {
  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.CANCEL_APPOINTMENT_BY_PROFESSIONAL(
      appointmentId,
    ),
    {},
  );
}

export function useCancelAppointmentByProfessional() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: cancelAppointmentByProfessional,
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Appointment cancelled" });
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: handleApiError,
  });
}
