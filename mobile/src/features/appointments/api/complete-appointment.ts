import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { type ProblemDetailsDto } from "@/types/enums.types";
import {
  appointmentKeys,
  type CompleteAppointmentRequest,
} from "@/entities/appointment";

function completeAppointment(request: CompleteAppointmentRequest) {
  const formData = new FormData();
  formData.append("prescriptionPdf", {
    uri: request.prescriptionPdf.uri,
    name: request.prescriptionPdf.name,
    type: request.prescriptionPdf.type,
  } as unknown as Blob);
  if (request.prescriptionTitle?.trim()) {
    formData.append("prescriptionTitle", request.prescriptionTitle.trim());
  }
  if (request.prescriptionNotes?.trim()) {
    formData.append("prescriptionNotes", request.prescriptionNotes.trim());
  }
  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.COMPLETE_APPOINTMENT(request.appointmentId),
    formData,
  );
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();
  const handleApiError = useHandleApiError();

  return useMutation<void, ProblemDetailsDto, CompleteAppointmentRequest>({
    mutationFn: completeAppointment,
    onSuccess: (_, request) => {
      Toast.show({ type: "success", text1: "Appointment completed" });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(request.appointmentId),
      });
    },
    onError: handleApiError,
  });
}
