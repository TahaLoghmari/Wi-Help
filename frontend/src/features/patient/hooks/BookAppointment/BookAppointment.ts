import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { ProblemDetailsDto } from "@/types";
import type { BookAppointmentRequest } from "@/features/patient";

const bookAppointment = (request: BookAppointmentRequest) => {
  return api.post<void>(API_ENDPOINTS.APPOINTMENTS.BOOK_APPOINTMENT, request);
};

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, BookAppointmentRequest>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionalAvailability"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
