import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { BookAppointmentRequest } from "@/features/patient";
import { toast } from "sonner";
import { handleApiError, useAppNavigation } from "@/hooks";
import i18n from "i18next";

const bookAppointment = (request: BookAppointmentRequest) => {
  return api.post<void>(API_ENDPOINTS.APPOINTMENTS.BOOK_APPOINTMENT, request);
};

export function useBookAppointment() {
  const queryClient = useQueryClient();
  const { goToBookingSuccess } = useAppNavigation();
  return useMutation<void, ProblemDetailsDto, BookAppointmentRequest>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionalAvailability"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      queryClient.invalidateQueries({
        queryKey: ["professional-appointments"],
      });
      // Invalidate notifications since a notification is sent to the professional
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
      toast.success(i18n.t("toasts.patient.appointmentBooked"));
      goToBookingSuccess();
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
