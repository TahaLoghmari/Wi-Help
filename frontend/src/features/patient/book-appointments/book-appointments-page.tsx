import { useBooking } from "./hooks/use-booking";
import { CalendarCard } from "./components/calendar-card";
import { AvailableSlots } from "./components/available-slots";
import { useParams } from "@tanstack/react-router";
import { ErrorComponent } from "@/components";
import { useProfessional } from "@/features/professional";
import { useEffect } from "react";

export function BookingPage() {
  const { professionalId } = useParams({ strict: false }) as Record<
    string,
    string | undefined
  >;

  const {
    state,
    form,
    availableSlots,
    monthlyAvailabilityQuery,
    bookAppointmentMutation,
    setSelectedDate,
    setSelectedSlot,
    handleBookSession,
  } = useBooking({ professionalId });

  const { data: professional, isLoading: isProfessionalLoading } =
    useProfessional(professionalId ?? "", !!professionalId);

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

  if (!professionalId) {
    return (
      <ErrorComponent
        title="Professional not found"
        message="Professional ID not found"
      />
    );
  }

  if (isProfessionalLoading) {
    return (
      <div className="flex w-full items-center justify-center p-10">
        <p>Loading professional details...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col justify-center space-y-6 overflow-auto p-10">
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
        {bookAppointmentMutation.isPending ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}
