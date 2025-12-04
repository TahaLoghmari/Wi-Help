import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { toFormData } from "@/lib/utils";
import type { CompleteAppointmentRequest } from "./CompleteAppointmentRequest";

export const completeAppointment = (request: CompleteAppointmentRequest) => {
  const formData = toFormData({
    prescriptionPdf: request.prescriptionPdf,
    prescriptionTitle: request.prescriptionTitle,
    prescriptionNotes: request.prescriptionNotes,
  });

  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.COMPLETE_APPOINTMENT(request.appointmentId),
    formData,
  );
};

export function CompleteAppointment() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, CompleteAppointmentRequest>({
    mutationFn: completeAppointment,
    onSuccess: () => {
      toast.success("Appointment completed successfully!");
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
