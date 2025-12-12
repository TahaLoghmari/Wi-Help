import { Clock, Timer, X, Loader2, Plus } from "lucide-react";
import { Spinner, Alert, AlertDescription, AlertTitle } from "@/components";
import { GenerateIdCrypto } from "@/lib";
import {
  DAYS,
  GetSchedule,
  SetupSchedule,
  GetCurrentProfessional,
} from "@/features/professional";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema } from "../../lib/professionalValidationSchemas";
import type { z } from "zod";

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export function ScheduleTimings() {
  const { t } = useTranslation();
  const { data: professional } = GetCurrentProfessional();
  const {
    data: currentSchedule,
    isLoading: isLoadingSchedule,
    isError,
  } = GetSchedule(professional?.id!);
  const { mutate: saveSchedule, isPending: isSaving } = SetupSchedule();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      days: DAYS.map((day) => ({
        dayOfWeek: day,
        isActive: false,
        availabilitySlots: [],
      })),
    },
  });

  const { handleSubmit, reset, watch, setValue } = form;

  // Watch days to render the list and slots
  const days = watch("days");

  useEffect(() => {
    if (currentSchedule) {
      const mergedDays = DAYS.map((day) => {
        const existingDay = currentSchedule.days.find(
          (d) => d.dayOfWeek === day,
        );
        return existingDay
          ? {
              ...existingDay,
              availabilitySlots: existingDay.availabilitySlots || [],
            }
          : {
              dayOfWeek: day,
              isActive: false,
              availabilitySlots: [],
            };
      });

      reset({
        days: mergedDays,
      });
    }
  }, [currentSchedule, reset]);

  if (isLoadingSchedule) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        {t("professional.schedule.error")}
      </div>
    );
  }

  const onSubmit = (data: ScheduleFormValues) => {
    saveSchedule(data);
  };

  const addTimeSlot = (dayIndex: number) => {
    const currentSlots = days[dayIndex].availabilitySlots || [];
    setValue(`days.${dayIndex}.availabilitySlots`, [
      ...currentSlots,
      { startTime: "09:00", endTime: "17:00", id: GenerateIdCrypto() },
    ]);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const currentSlots = days[dayIndex].availabilitySlots;
    setValue(
      `days.${dayIndex}.availabilitySlots`,
      currentSlots.filter((_, i) => i !== slotIndex),
    );
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setValue(`days.${dayIndex}.availabilitySlots.${slotIndex}.${field}`, value);
  };

  const toggleDay = (dayIndex: number, checked: boolean) => {
    setValue(`days.${dayIndex}.isActive`, checked);
  };

  if (isLoadingSchedule) {
    return (
      <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-brand-teal/10 text-brand-teal flex h-10 w-10 items-center justify-center rounded-xl">
            <Timer className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-brand-dark text-lg font-semibold tracking-tight">
              {t("professional.schedule.title")}
            </h2>
            <p className="text-xs text-slate-500">
              {t("professional.schedule.subtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(form.formState.errors).length > 0 && (
            <Alert variant={"destructive"}>
              <AlertTitle>
                {t("professional.schedule.validationError")}
              </AlertTitle>
              <AlertDescription>
                {t("professional.schedule.checkErrors")}
              </AlertDescription>
            </Alert>
          )}

          {days.map((day, dayIndex) => (
            <div
              key={day.dayOfWeek}
              className="group hover:border-brand-blue/30 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={day.isActive}
                    onClick={() => toggleDay(dayIndex, !day.isActive)}
                    className={`focus-visible:ring-brand-blue relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                      day.isActive ? "bg-brand-teal" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                        day.isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div>
                    <h3 className="text-brand-dark text-sm font-semibold">
                      {day.dayOfWeek}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {day.isActive
                        ? `${day.availabilitySlots?.length || 0} ${t("professional.schedule.slotsConfigured")}`
                        : t("professional.schedule.notAvailable")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {day.isActive && (
                <div className="space-y-3 border-t border-slate-100 p-5">
                  {day.availabilitySlots?.map((slot, slotIndex) => (
                    <div
                      key={slot.id || slotIndex}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-2"
                    >
                      <Clock className="text-brand-blue ml-2 h-4 w-4" />
                      <div className="flex items-center gap-2">
                        <select
                          value={slot.startTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              dayIndex,
                              slotIndex,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="focus:border-brand-blue focus:ring-brand-blue/20 h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-700"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        <span className="text-xs text-slate-400">
                          {t("professional.schedule.to")}
                        </span>
                        <select
                          value={slot.endTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              dayIndex,
                              slotIndex,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="focus:border-brand-blue focus:ring-brand-blue/20 h-8 rounded-lg border-slate-200 bg-white text-xs text-slate-700"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dayIndex)}
                    className="hover:border-brand-blue hover:bg-brand-blue/5 hover:text-brand-blue flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white py-2.5 text-xs font-medium text-slate-600 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {t("professional.schedule.addSlot")}
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-dark hover:bg-brand-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-medium text-white shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("professional.schedule.save")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
