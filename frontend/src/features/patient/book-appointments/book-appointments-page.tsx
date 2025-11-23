import { useBooking } from "./hooks/use-booking";
import { CalendarCard } from "./components/calendar-card";
import { AvailableSlots } from "./components/available-slots";

export function BookingPage() {
  // TODO: Get professionalId from route params or props
  const professionalId = "cd61772a-f6da-4409-860a-f4112c9e396a"; // Placeholder

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
