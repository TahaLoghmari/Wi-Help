import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";

export interface RespondToAppointmentDto {
  appointmentId: string;
  isAccepted: boolean;
}

export const respondToAppointment = (data: RespondToAppointmentDto) => {
  return api.post<void>(API_ENDPOINTS.PROFESSIONALS.RESPOND_TO_APPOINTMENT, {
    appointmentId: data.appointmentId,
    isAccepted: data.isAccepted,
  });
};

export function useRespondToAppointment() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, RespondToAppointmentDto>({
    mutationFn: respondToAppointment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["professionalAppointments"] });
      toast.success(
        variables.isAccepted
          ? "Appointment accepted successfully!"
          : "Appointment rejected successfully!"
      );
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
