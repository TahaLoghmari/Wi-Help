import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Timer, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, Card, CardContent, CardHeader, SelectItem, CardTitle, Select, SelectContent, SelectTrigger, SelectValue } from "@/components";
import { Switch } from "@/components/ui/switch";
import { GenerateIdCrypto } from "@/lib";
import { DAYS } from "../types/api.types";
import { useEffect } from "react";
import { useCurrentSchedule } from "../hooks/useCurrentSchedule";
import { useSetupSchedule } from "../hooks/useSetupSchedule";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleFormSchema } from "../settings/lib/settingsValidationSchemas";
import type { z } from "zod";

export const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export function ScheduleTimings() {
    const { data: currentSchedule, isLoading: isLoadingSchedule } = useCurrentSchedule();
    const { mutate: saveSchedule, isPending: isSaving } = useSetupSchedule();

    const form = useForm<ScheduleFormValues>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            timeZoneId: "Africa/Tunis",
            days: DAYS.map(day => ({
                dayOfWeek: day,
                isActive: false,
                availabilitySlots: []
            }))
        }
    });

    const { handleSubmit, reset, watch, setValue } = form;

    // Watch days to render the list and slots
    const days = watch("days");

    useEffect(() => {
        if (currentSchedule) {
            const mergedDays = DAYS.map(day => {
                const existingDay = currentSchedule.days.find(d => d.dayOfWeek === day);
                return existingDay ? {
                    ...existingDay,
                    availabilitySlots: existingDay.availabilitySlots || []
                } : {
                    dayOfWeek: day,
                    isActive: false,
                    availabilitySlots: []
                };
            });

            reset({
                timeZoneId: currentSchedule.timeZoneId || "Africa/Tunis",
                days: mergedDays
            });
        }
    }, [currentSchedule, reset]);

    const onSubmit = (data: ScheduleFormValues) => {
        saveSchedule(data);
    };

    const addTimeSlot = (dayIndex: number) => {
        const currentSlots = days[dayIndex].availabilitySlots || [];
        setValue(`days.${dayIndex}.availabilitySlots`, [
            ...currentSlots,
            { startTime: "09:00", endTime: "17:00", id: GenerateIdCrypto() }
        ]);
    };

    const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
        const currentSlots = days[dayIndex].availabilitySlots;
        setValue(`days.${dayIndex}.availabilitySlots`, currentSlots.filter((_, i) => i !== slotIndex));
    };

    const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: string) => {
        setValue(`days.${dayIndex}.availabilitySlots.${slotIndex}.${field}`, value);
    };

    const toggleDay = (dayIndex: number, checked: boolean) => {
        setValue(`days.${dayIndex}.isActive`, checked);
    };

    if (isLoadingSchedule) {
        return <div className="flex h-40 w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="p-4 overflow-auto">

            <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="w-full">
                    <div className="flex items-center text-lg font-semibold text-[#00394a] gap-3 justify-start">
                        <Timer className="h-5 w-5" />
                        Setup Schedule
                    </div>
                </div>
                <div className="space-y-4 p-1">
                    {Object.keys(form.formState.errors).length > 0 && (
                        <Alert variant={'destructive'}>
                            <AlertTitle>Validation Error</AlertTitle>
                            <AlertDescription>
                                Please check the form for errors.
                            </AlertDescription>
                        </Alert>
                    )}

                    {days.map((day, dayIndex) => (
                        <Card key={day.dayOfWeek} className="cursor-pointer">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Switch
                                            checked={day.isActive}
                                            onCheckedChange={(checked) => toggleDay(dayIndex, checked)}
                                            className="border-border border"
                                        />
                                        <div>
                                            <CardTitle className="text-lg">{day.dayOfWeek}</CardTitle>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {day.isActive
                                                    ? `${day.availabilitySlots?.length || 0} time slot${(day.availabilitySlots?.length || 0) !== 1 ? 's' : ''} configured`
                                                    : 'Not available'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            {day.isActive && (
                                <CardContent className="space-y-3">
                                    {day.availabilitySlots?.map((slot, slotIndex) => (
                                        <div key={slot.id || slotIndex} className="bg-accent card flex items-center gap-3 rounded-lg border p-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <Select
                                                value={slot.startTime}
                                                onValueChange={(val) => updateTimeSlot(dayIndex, slotIndex, 'startTime', val)}
                                            >
                                                <SelectTrigger className="w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_OPTIONS.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <span className="text-gray-500">to</span>
                                            <Select
                                                value={slot.endTime}
                                                onValueChange={(val) => updateTimeSlot(dayIndex, slotIndex, 'endTime', val)}
                                            >
                                                <SelectTrigger className="w-24">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {TIME_OPTIONS.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                                className="ml-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTimeSlot(dayIndex)}
                                        className="w-full"
                                    >
                                        + Add Time Slot
                                    </Button>
                                </CardContent>
                            )}
                        </Card>
                    ))}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Schedule
                        </Button>
                    </div>
                </div>
            </form >
        </div >

    );
}
