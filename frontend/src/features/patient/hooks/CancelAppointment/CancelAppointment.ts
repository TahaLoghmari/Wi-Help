import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

export const cancelAppointment = (appointmentId: string) => {
  return api.post<void>(
    API_ENDPOINTS.APPOINTMENTS.CANCEL_APPOINTMENT(appointmentId),
  );
};

export function CancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      toast.success("Appointment cancelled successfully!");
      queryClient.invalidateQueries({
        queryKey: ["patient-appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
