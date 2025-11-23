import { Calendar as CalendarIcon } from "lucide-react";
import {
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";

export function CalendarCard({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}) {
  return (
    <div className="border-border flex w-full flex-1 flex-col items-center justify-center rounded-xl border shadow-xs">
      {/* <div className="flex items-center gap-2 p-4 font-semibold">
        <CalendarIcon className="h-5 w-5" />
        Select Date
      </div> */}

      <Calendar
        mode="single"
        className="rounded-xl border-0"
        captionLayout="label"
        defaultMonth={selectedDate}
        onSelect={setSelectedDate}
        selected={selectedDate}
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }}
        showOutsideDays={false}
      />
    </div>
  );
}
