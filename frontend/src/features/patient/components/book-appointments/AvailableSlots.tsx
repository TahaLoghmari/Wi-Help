import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@/components";
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
    <Card className="flex-3">
      <CardHeader>
        <CardTitle>Available Time Slots</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-lg border p-3 ${
                  selectedSlot?.startTime === slot.startTime
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No available slots for selected date</p>
        )}
      </CardContent>
    </Card>
  );
}
