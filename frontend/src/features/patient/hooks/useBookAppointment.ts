import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { ProblemDetailsDto } from "@/types/api.types";

export interface BookAppointmentRequest {
  professionalId: string;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
  price: number;
  timeZoneId: string;
  notes: string;
}

const bookAppointment = (request: BookAppointmentRequest) => {
  return api.post<void>(API_ENDPOINTS.PATIENTS.BOOK_APPOINTMENT, request);
};

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation<void, ProblemDetailsDto, BookAppointmentRequest>({
    mutationFn: bookAppointment,
    onSuccess: () => {
      // Invalidate relevant queries on successful booking
      queryClient.invalidateQueries({ queryKey: ["professionalAvailability"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
