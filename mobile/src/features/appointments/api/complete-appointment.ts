import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APPOINTMENT_ENDPOINTS } from "@/features/appointments/api/endpoints";
import { api } from "@/shared/api/api-client";
import type { ProblemDetailsDto } from "@/shared/api/enums.types";
import type { CompleteAppointmentRequest } from "./contracts";
import { appointmentKeys } from "./keys";

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
    APPOINTMENT_ENDPOINTS.COMPLETE_APPOINTMENT(request.appointmentId),
    formData,
  );
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, CompleteAppointmentRequest>({
    mutationFn: completeAppointment,
    onSuccess: (_, request) => {
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.lists(),
      });
      void queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(request.appointmentId),
      });
    },
  });
}
