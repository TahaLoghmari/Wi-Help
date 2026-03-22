import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { type ProblemDetailsDto } from "@/types/enums.types";

export interface CompleteAppointmentRequest {
  appointmentId: string;
  prescriptionPdf: { uri: string; name: string; type: string };
  prescriptionTitle?: string;
  prescriptionNotes?: string;
}

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
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Appointment completed" });
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: handleApiError,
  });
}
