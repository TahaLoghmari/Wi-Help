import { useBookAppointment } from "@/features/patient/hooks";
import type {
  TimeSlotResponse,
  DailyAvailabilityResponse,
  MonthlyAvailabilityResponse,
} from "@/features/patient/types";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { logger } from "@/lib";
import { type BookingStep, type SessionSlotType } from "@/features/patient";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { CalendarCard } from "./CalendarCard";
import { AvailableSlots } from "./AvailableSlots";
import { useParams } from "@tanstack/react-router";
import { ErrorComponent } from "@/components";
import { useEffect } from "react";
import { Spinner } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";
import type { GetProfessionalDto } from "@/features/professional/hooks/GetProfessional/GetProfessionalDto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { patientFormSchema } from "../../lib/patientValidationSchemas";
import { patientFormDefaults } from "../../lib/patientFormDefaults";
import type z from "zod";

export function BookAppointmentsLayout() {
  const { professionalId } = useParams({ strict: false });

  const navigate = useNavigate();
  const bookAppointmentMutation = useBookAppointment();

  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patientFormDefaults(),
  });

  const { watch, setValue, reset } = form;
  const state = watch();

  const monthlyAvailabilityQuery = useQuery({
    queryKey: [
      "professionalAvailability",
      professionalId,
      state.selectedDate?.getFullYear(),
      state.selectedDate ? state.selectedDate.getMonth() + 1 : undefined,
    ],
    queryFn: async () => {
      if (!professionalId || !state.selectedDate)
        throw new Error("Invalid parameters");
      const year = state.selectedDate.getFullYear();
      const month = state.selectedDate.getMonth() + 1;
      const queryString = `year=${year}&month=${month}`;
      return api.get<MonthlyAvailabilityResponse>(
        `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_AVAILABILITY(professionalId)}?${queryString}`,
      );
    },
    enabled: !!professionalId && !!state.selectedDate,
  });

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
    async (data: PatientFormState) => {
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

  const professionalQuery = useQuery<GetProfessionalDto>({
    queryKey: ["professional", professionalId],
    queryFn: () =>
      api.get<GetProfessionalDto>(
        `${API_ENDPOINTS.PROFESSIONALS.GET_PROFESSIONAL_BY_ID}/${professionalId}`,
      ),
    enabled: !!professionalId,
  });

  const {
    data: professional,
    isLoading: isProfessionalLoading,
    isError,
  } = professionalQuery;

  const { selectedDate, selectedSlot, price } = state;
  const { isLoading } = monthlyAvailabilityQuery;

  // Set the price from professional data when it's available
  useEffect(() => {
    if (professional && !price) {
      // Use the average of start and end price
      const averagePrice =
        (professional.startPrice + professional.endPrice) / 2;
      form.setValue("price", averagePrice);
    }
  }, [professional, price, form]);

  if (isProfessionalLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorComponent
        title="Error"
        message="Error loading professional details."
      />
    );
  }

  if (!professionalId) {
    return (
      <ErrorComponent
        title="Professional not found"
        message="Professional ID not found"
      />
    );
  }

  return (
    <Form {...form}>
      <div className="flex h-full w-full flex-col justify-center space-y-6 overflow-y-auto p-10">
        {/* Calendar */}
        <div className="flex w-full flex-col justify-center gap-10 md:flex-row">
          <CalendarCard
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <AvailableSlots
            isLoading={isLoading}
            availableSlots={availableSlots}
            setSelectedSlot={setSelectedSlot}
            selectedSlot={selectedSlot}
          />
        </div>

        {/* Price Display */}
        {professional && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Session Price:
              </span>
              <span className="text-lg font-semibold text-[#00394a]">
                {price} TND
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Professional's price range: {professional.startPrice} -{" "}
              {professional.endPrice} TND
            </p>
          </div>
        )}

        {/* Notes */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Additional Notes (Optional)
                </FormLabel>
                <FormControl>
                  <textarea
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="Enter any additional notes for the appointment"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Book Button */}
        <button
          onClick={handleBookSession}
          disabled={
            !selectedDate ||
            !selectedSlot ||
            !price ||
            bookAppointmentMutation.isPending
          }
          className="w-full rounded-lg bg-[#00394a] px-4 py-2 text-white disabled:bg-gray-300"
        >
          {bookAppointmentMutation.isPending
            ? "Booking..."
            : "Book Appointment"}
        </button>
      </div>
    </Form>
  );
}
