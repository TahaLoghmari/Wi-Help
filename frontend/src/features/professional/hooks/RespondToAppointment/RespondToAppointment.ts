import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import type { RespondToAppointmentRequest } from "@/features/professional";

export const respondToAppointment = (request: RespondToAppointmentRequest) => {
  const body = {
    isAccepted: request.isAccepted,
  };
  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.RESPOND_TO_APPOINTMENT(request.appointmentId),
    body,
  );
};

export function RespondToAppointment() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, RespondToAppointmentRequest>({
    mutationFn: respondToAppointment,
    onSuccess: () => {
      toast.success("Appointment status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-appointments"],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
