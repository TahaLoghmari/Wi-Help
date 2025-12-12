import {
  useBookAppointment,
  type TimeSlotResponse,
  type DailyAvailabilityResponse,
  AvailableSlots,
  AppointmentNotes,
  AppointmentUrgencySelector,
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
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export function BookAppointmentsLayout() {
  const { t } = useTranslation();
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

  if (isProfessionalPending || isLoading)
    return <div>{t("patient.booking.loading")}</div>;
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
      urgency: credentials.urgency,
      notes: credentials.notes || "",
    });
  };

  return (
    <Form {...form}>
      <section className="flex flex-1 flex-col gap-5 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="group mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to professional
            </button>
            <div>
              <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
                Book Appointment
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Select a date and time slot to book your appointment.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 lg:flex-row">
          {/* Left: Calendar & Session Price */}
          <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-none">
            {/* Calendar */}
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 lg:mx-0">
              <Calendar
                mode="single"
                className="rounded-xl border-0 p-0 [--cell-size:--spacing(9)]"
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
                classNames={{
                  months: "flex flex-col",
                  month: "space-y-2",
                  caption_label: "text-sm font-semibold text-slate-900",
                  nav: "flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between px-1",
                  button_previous:
                    "p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors",
                  button_next:
                    "p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors",
                  weekdays: "flex",
                  weekday:
                    "text-[11px] font-medium text-slate-400 py-1 flex-1 text-center",
                  week: "flex w-full mt-1",
                  day: "p-0 text-center flex-1 aspect-square",
                  today: "bg-slate-100 text-slate-900 font-medium rounded-lg",
                  selected: "bg-[#00394a] text-white font-medium  rounded-lg",
                  outside: "text-slate-300",
                  disabled: "text-slate-300 opacity-50",
                }}
              />
            </div>

            {/* Session Price Card */}
            {professional && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">
                    Session Price
                  </span>
                  <span className="text-brand-dark text-sm font-semibold">
                    {price} TND
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Professional range: {professional.startPrice} -{" "}
                  {professional.endPrice} TND
                </p>
              </div>
            )}
          </div>

          {/* Right: Slots & Actions */}
          <div className="w-full flex-1 space-y-4">
            {/* Time Slots */}
            <AvailableSlots
              isLoading={isLoading}
              availableSlots={availableSlots}
              setSelectedSlot={handleSlotSelect}
              selectedSlot={selectedSlot}
            />

            {/* Urgency Selector */}
            <AppointmentUrgencySelector control={form.control} />

            {/* Notes */}
            <AppointmentNotes control={form.control} />

            {/* Action Button */}
            <button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-brand-dark hover:bg-brand-secondary w-full rounded-xl py-2.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {bookAppointmentMutation.isPending
                ? "Booking..."
                : "Book Appointment"}
            </button>
          </div>
        </div>
      </section>
    </Form>
  );
}
