import { Spinner } from "@/components";
import type { TimeSlotResponse } from "../../types";

export function AvailableSlots({
  isLoading,
  availableSlots,
  setSelectedSlot,
  selectedSlot,
}: {
  isLoading: boolean;
  availableSlots: TimeSlotResponse[];
  setSelectedSlot: (
    slot: {
      startTime: string;
      endTime: string;
      isAvailable: boolean;
      isBooked: boolean;
    } | null,
  ) => void;
  selectedSlot: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    isBooked: boolean;
  } | null;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-brand-dark text-xs font-semibold">
        Available Time Slots
      </h3>
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner />
        </div>
      ) : availableSlots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                selectedSlot?.startTime === slot.startTime
                  ? "border-brand-blue text-brand-blue bg-brand-blue/5"
                  : "hover:border-brand-blue hover:text-brand-blue hover:bg-brand-blue/5 border-slate-200 bg-white text-slate-700"
              }`}
            >
              {slot.startTime} - {slot.endTime}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          No available slots for selected date
        </p>
      )}
    </div>
  );
}
