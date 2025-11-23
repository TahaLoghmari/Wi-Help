import { useBooking } from "./hooks/use-booking";
import { CalendarCard } from "./components/calendar-card";
import { AvailableSlots } from "./components/available-slots";
import { useParams } from "@tanstack/react-router";
import { ErrorComponent } from "@/components";

export function BookingPage() {
  const { professionalId } = useParams({ strict: false }) as Record<
    string,
    string | undefined
  >;

  const {
    state,
    availableSlots,
    monthlyAvailabilityQuery,
    setSelectedDate,
    setSelectedSlot,
    handleBookSession,
  } = useBooking({ professionalId });

  const { selectedDate, selectedSlot } = state;
  const { isLoading } = monthlyAvailabilityQuery;

  if (!professionalId) {
    return (
      <ErrorComponent
        title="Professional not found"
        message="Professional ID not found"
      />
    );
  }

  return (
    <div className="flex w-full flex-col justify-center space-y-6 p-10">
      {/* Calendar */}
      <div className="flex w-full flex-col justify-center gap-10 sm:flex-row">
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
      {/* Book Button */}
      <button
        onClick={handleBookSession}
        disabled={!selectedDate || !selectedSlot}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
      >
        Book Appointment (Mocked)
      </button>
    </div>
  );
}
