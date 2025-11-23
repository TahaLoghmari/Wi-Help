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
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center justify-center">
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
      </CardContent>
    </Card>
  );
}
