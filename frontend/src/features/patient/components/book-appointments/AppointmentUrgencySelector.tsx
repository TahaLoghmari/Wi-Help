import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui";
import type { Control } from "react-hook-form";
import { AppointmentUrgency as UrgencyEnum } from "@/features/professional";
import { useTranslation } from "react-i18next";

interface AppointmentUrgencySelectorProps {
  control: Control<any>;
}

export function AppointmentUrgencySelector({
  control,
}: AppointmentUrgencySelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5">
      <FormField
        control={control}
        name="urgency"
        render={({ field }) => (
          <FormItem>
            <label className="block text-xs font-medium text-slate-700">
              {t("patient.booking.urgency.label")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <FormControl>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => field.onChange(UrgencyEnum.Low)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    field.value === UrgencyEnum.Low
                      ? "border-brand-blue bg-brand-blue/10 text-brand-dark"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{t("patient.booking.urgency.low")}</span>
                    <span className="text-[10px] text-slate-500">
                      {t("patient.booking.urgency.routine")}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(UrgencyEnum.Medium)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    field.value === UrgencyEnum.Medium
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{t("patient.booking.urgency.medium")}</span>
                    <span className="text-[10px] text-slate-500">
                      {t("patient.booking.urgency.week")}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(UrgencyEnum.High)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-xs font-medium transition-all ${
                    field.value === UrgencyEnum.High
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{t("patient.booking.urgency.high")}</span>
                    <span className="text-[10px] text-slate-500">
                      {t("patient.booking.urgency.urgent")}
                    </span>
                  </div>
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
