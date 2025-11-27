import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import type { Control } from "react-hook-form";

interface AppointmentNotesProps {
  control: Control<any>;
}

export function AppointmentNotes({ control }: AppointmentNotesProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <FormField
        control={control}
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
  );
}
