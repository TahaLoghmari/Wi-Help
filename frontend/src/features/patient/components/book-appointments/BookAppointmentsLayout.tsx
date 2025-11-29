import {
  useBookAppointment,
  type TimeSlotResponse,
  type DailyAvailabilityResponse,
  AvailableSlots,
  AppointmentNotes,
  bookAppointmentFormSchema,
  bookAppointmentFormDefaults,
} from "@/features/patient";
import {
  GetProfessional,
  GetProfessionalAvailability,
} from "@/features/professional";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "@tanstack/react-router";
import { Form, Calendar } from "@/components";
import { useState } from "react";
import type z from "zod";

export function BookAppointmentsLayout() {
  const form = useForm<z.infer<typeof bookAppointmentFormSchema>>({
    resolver: zodResolver(bookAppointmentFormSchema),
    defaultValues: bookAppointmentFormDefaults(),
  });

  const { professionalId } = useParams({ strict: false });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotResponse | null>(
    null,
  );
  const bookAppointmentMutation = useBookAppointment();
  const { data: professional, isPending: isProfessionalPending } =
    GetProfessional({
      professionalId: professionalId || "",
    });
  // this gives us each day slots of current selected month and year
  const { data, isLoading } = GetProfessionalAvailability({
    professionalId: professionalId || "",
    year: selectedDate?.getFullYear() || new Date().getFullYear(),
    month: (selectedDate?.getMonth() || new Date().getMonth()) + 1,
  });

  if (isProfessionalPending || isLoading) return <div>Loading..</div>;
  // from the above data we get just the selected day
  const selectedDayData: DailyAvailabilityResponse | undefined =
    selectedDate && data
      ? data.days.find((day: DailyAvailabilityResponse) => {
          const dayDate = new Date(day.date);
          return (
            dayDate.getDate() === selectedDate.getDate() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getFullYear() === selectedDate.getFullYear()
          );
        })
      : undefined;

  // we filter already booked appointments
  const availableSlots =
    selectedDayData?.timeSlots.filter(
      (slot: TimeSlotResponse) => slot.isAvailable && !slot.isBooked,
    ) || [];

  const { setValue } = form;

  // Select date from calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset slot when date changes
    setValue("startDate", "");
    setValue("endDate", "");
  };

  // Select time slot from available slots of that day
  const handleSlotSelect = (slot: TimeSlotResponse | null) => {
    setSelectedSlot(slot);
    if (slot && selectedDate) {
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      const startDateTime = new Date(`${dateStr}T${slot.startTime}`);
      const endDateTime = new Date(`${dateStr}T${slot.endTime}`);
      setValue("startDate", startDateTime.toISOString());
      setValue("endDate", endDateTime.toISOString());
      setValue("price", price);
    } else {
      setValue("startDate", "");
      setValue("endDate", "");
      setValue("price", 0);
    }
  };
  const price = (professional!.startPrice + professional!.endPrice) / 2;
  const onSubmit = async (
    credentials: z.infer<typeof bookAppointmentFormSchema>,
  ) => {
    bookAppointmentMutation.mutate({
      professionalId: professional!.id,
      startDate: credentials.startDate,
      endDate: credentials.endDate,
      price: price,
      urgency: "Medium",
      notes: credentials.notes || "",
    });
  };

  return (
    <Form {...form}>
      <div className="flex h-full w-full flex-col justify-center space-y-6 overflow-auto p-10">
        <div className="flex w-full flex-col justify-center gap-10 md:flex-row">
          <div className="border-border flex w-full flex-1 flex-col items-center justify-center rounded-xl border shadow-xs">
            <Calendar
              mode="single"
              className="rounded-xl border-0"
              captionLayout="label"
              defaultMonth={selectedDate}
              onSelect={handleDateSelect}
              selected={selectedDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              showOutsideDays={false}
            />
          </div>
          <AvailableSlots
            isLoading={isLoading}
            availableSlots={availableSlots}
            setSelectedSlot={handleSlotSelect}
            selectedSlot={selectedSlot}
          />
        </div>
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
        <AppointmentNotes control={form.control} />
        <button
          onClick={form.handleSubmit(onSubmit)}
          disabled={!selectedSlot || bookAppointmentMutation.isPending}
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
