import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AppointmentNotesProps {
  control: Control<any>;
}

export function AppointmentNotes({ control }: AppointmentNotesProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <label className="block text-xs font-medium text-slate-700">
              {t("patient.booking.notes.label")}
            </label>
            <FormControl>
              <textarea
                className="focus:border-brand-blue focus:ring-brand-blue/50 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs transition-all placeholder:text-slate-400 focus:ring-1 focus:outline-none"
                placeholder={t("patient.booking.notes.placeholder")}
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
