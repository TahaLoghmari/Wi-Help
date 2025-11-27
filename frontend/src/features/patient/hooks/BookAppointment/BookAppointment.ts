import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { BookAppointmentRequest } from "@/features/patient";
import { toast } from "sonner";
import { handleApiError, useAppNavigation } from "@/hooks";

const bookAppointment = (request: BookAppointmentRequest) => {
  console.log(request);
  return api.post<void>(API_ENDPOINTS.APPOINTMENTS.BOOK_APPOINTMENT, request);
};

export function useBookAppointment() {
  const queryClient = useQueryClient();
  const { goToBookingSuccess } = useAppNavigation();
  return useMutation<void, ProblemDetailsDto, BookAppointmentRequest>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionalAvailability"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(`Appointment booked successfully!`);
      goToBookingSuccess();
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
