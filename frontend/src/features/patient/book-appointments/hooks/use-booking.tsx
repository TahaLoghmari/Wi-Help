import {
  useProfessionalAvailability,
  useBookAppointment,
} from "@/features/patient/hooks";
import type {
  TimeSlotResponse,
  DailyAvailabilityResponse,
} from "@/features/patient/types";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logger } from "@/lib";
import {
  bookingHookStateSchema,
  type BookingHookState,
  type BookingStep,
  type SessionSlotType,
} from "@/features/patient/book-appointments/consts";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";

export function useBooking({ professionalId }: { professionalId?: string }) {
  const navigate = useNavigate();
  const bookAppointmentMutation = useBookAppointment();

  const form = useForm<BookingHookState>({
    resolver: zodResolver(bookingHookStateSchema),
    defaultValues: {
      selectedDate: new Date(),
      selectedSlot: null,
      step: "select",
      price: 0,
      notes: "",
    },
  });

  const { watch, setValue, reset } = form;
  const state = watch();

  const monthlyAvailabilityQuery = useProfessionalAvailability(
    professionalId,
    state.selectedDate?.getFullYear(),
    state.selectedDate ? state.selectedDate.getMonth() + 1 : undefined,
    { enabled: !!professionalId && !!state.selectedDate },
  );

  // From the monthly data, get the selected day data
  const selectedDayData: DailyAvailabilityResponse | undefined =
    state.selectedDate && monthlyAvailabilityQuery.data
      ? monthlyAvailabilityQuery.data.days.find(
          (day: DailyAvailabilityResponse) => {
            const dayDate = new Date(day.date);
            return (
              dayDate.getDate() === state.selectedDate!.getDate() &&
              dayDate.getMonth() === state.selectedDate!.getMonth() &&
              dayDate.getFullYear() === state.selectedDate!.getFullYear()
            );
          },
        )
      : undefined;

  // Available slots for that selected day
  const availableSlots =
    selectedDayData?.timeSlots.filter(
      (slot: TimeSlotResponse) => slot.isAvailable && !slot.isBooked,
    ) || [];

  // Actions

  // Select date from calendar
  const setSelectedDate = (date: Date | undefined) => {
    setValue("selectedDate", date);
    setValue("selectedSlot", null); // Reset slot when date changes
  };

  // Select time slot from available slots of that day
  const setSelectedSlot = (slot: SessionSlotType | null) => {
    setValue("selectedSlot", slot);
  };

  // Change the step of the booking process
  const setStep = (step: BookingStep) => {
    setValue("step", step);
  };

  // Reset the booking process
  const resetBooking = () => {
    reset({
      selectedDate: undefined,
      selectedSlot: null,
      step: "select",
      price: 0,
      notes: "",
    });
  };

  // Handle booking submission with real API
  const handleBookSession = form.handleSubmit(
    async (data: BookingHookState) => {
      if (!data.selectedDate || !data.selectedSlot || !professionalId) {
        toast.error("Please select a date and time slot.");
        return;
      }

      try {
        setStep("confirm");

        // Build the start and end DateTime in ISO format
        const dateStr = data.selectedDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
        const startDateTime = new Date(
          `${dateStr}T${data.selectedSlot.startTime}`,
        );
        const endDateTime = new Date(`${dateStr}T${data.selectedSlot.endTime}`);

        logger.info("Booking appointment:", {
          professionalId,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          price: data.price,
          notes: data.notes || "",
        });

        // Note: userId will be extracted from authentication token on the backend
        // We pass it here but the backend will override it with the authenticated user
        await bookAppointmentMutation.mutateAsync({
          professionalId,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          price: data.price,
          timeZoneId:
            Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Tunis",
          notes: data.notes || "",
        });

        toast.success(
          `Appointment booked successfully!\nDate: ${data.selectedDate.toLocaleDateString()}\nTime: ${data.selectedSlot.startTime} - ${data.selectedSlot.endTime}`,
        );

        resetBooking();
        navigate({ to: ROUTE_PATHS.PATIENT.BOOK_SUCCESS });
      } catch (error) {
        logger.error("Booking failed:", error);
        toast.error("Failed to book appointment. Please try again.");
        setStep("error");
      }
    },
  );

  return {
    // Form instance
    form,

    // State
    state,

    // Computed values
    selectedDayData,
    availableSlots,

    // Queries
    monthlyAvailabilityQuery,

    // Mutations
    bookAppointmentMutation,

    // Actions
    setSelectedDate,
    setSelectedSlot,
    setStep,
    resetBooking,
    handleBookSession,
  };
}
