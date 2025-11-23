import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Clock, Timer, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, Card, CardContent, CardHeader, SelectItem, CardTitle, Select, SelectContent, SelectTrigger, SelectValue } from "@/components";
import { Switch } from "@radix-ui/react-switch";
import { GenerateIdCrypto } from "@/lib";

export const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type DayOfWeek = (typeof DAYS)[number];
export function ScheduleTimings() {
    const { schedule, actions, error } = useFormSchedule(form);

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="social-links">
                <AccordionTrigger className="text-foreground hover:text-primary text-md">
                    <div className="flex items-start justify-center gap-3">
                        <Timer />
                        Setup Schedule
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                    {error && (
                        <Alert variant={'destructive'} className="">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {DAYS.map((day) => {
                        const daySchedule = schedule.find((s) => s.dayOfWeek === day);
                        if (!daySchedule) return null;

                        return (
                            <Card key={day} className={`cursor-pointer`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Switch className="border-border border" checked={daySchedule.isActive} onCheckedChange={() => actions.toggleDay(day)} />
                                            <div>
                                                <CardTitle className="text-lg">{day.charAt(0).toUpperCase() + day.slice(1)}</CardTitle>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {daySchedule.isActive
                                                        ? `${daySchedule.availabilityRanges.length} time slot${daySchedule.availabilityRanges.length !== 1 ? 's' : ''} configured`
                                                        : 'Not available'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                {daySchedule.isActive && (
                                    <CardContent className="space-y-3">
                                        {/* Time Ranges */}
                                        {daySchedule.availabilityRanges.map((range) => {
                                            const rangeId = range.id?.toString() || GenerateIdCrypto();
                                            return (
                                                <div key={rangeId} className="bg-accent card flex items-center gap-3 rounded-lg border p-2">
                                                    <Clock className="h-4 w-4 text-gray-500" />
                                                    <Select
                                                        value={range.startTime}
                                                        onValueChange={(value) => actions.updateTimeRange(day, range.id?.toString() || '0', 'startTime', value)}
                                                    >
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_OPTIONS.map((time) => (
                                                                <SelectItem key={GenerateIdCrypto()} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <span className="text-gray-500">to</span>

                                                    <Select value={range.endTime} onValueChange={(value) => actions.updateTimeRange(day, rangeId, 'endTime', value)}>
                                                        <SelectTrigger className="w-24">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_OPTIONS.map((time) => (
                                                                <SelectItem key={GenerateIdCrypto()} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => actions.removeTimeRange(day, range.id?.toString() || '')}
                                                        className="ml-auto text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            );
                                        })}

                                        {/* Add Time Slot Button */}
                                        <Button type="button" variant="outline" size="sm" onClick={() => actions.addCustomTimeSlot(day)} className="w-full">
                                            + Add Time Slot
                                        </Button>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </AccordionContent>
                {/* Form Validation Error
                <FormField
                    control={form.control}
                    name="dayAvailabilities"
                    render={() => (
                        <FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
            </AccordionItem>
        </Accordion>
    );
}



export interface UseFormScheduleReturn {
    error: string;
    schedule: DailySchedule[];
    selectedCopySource: DayOfWeek | null;
    actions: {
        setSelectedCopySource: (day: DayOfWeek | null) => void;
        toggleDay: (day: DayOfWeek) => void;
        addTimeSlot: (day: DayOfWeek, slot: { startTime: string; endTime: string }) => void;
        addCustomTimeSlot: (day: DayOfWeek) => void;
        updateTimeRange: (day: DayOfWeek, rangeId: string, field: 'startTime' | 'endTime', value: string) => void;
        removeTimeRange: (day: DayOfWeek, rangeId: string) => void;
        copyAvailability: (fromDay: DayOfWeek, toDay: DayOfWeek) => void;
        resetChanges: () => void;
    };
    getScheduleSummary: () => { enabledDays: number; totalSlots: number };
}

// Default schedule for 7 days of the week
const createDefaultSchedule = (): DailySchedule[] => {
    return Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: mapNumberToDay(i)!,
        isActive: false,
        availabilityRanges: [],
    }));
};

const DAY_AVAILABILITES_KEY_FORM = 'dayAvailabilities';

export function useFormSchedule(form: UseFormReturn<CreateProductInput | EditProductFormData>): UseFormScheduleReturn {
    const [selectedCopySource, setSelectedCopySource] = useState<DayOfWeek | null>(null);
    const [error, setError] = useState<string>('');
    // Watch the dayAvailabilities field from the form
    const formSchedule = form.watch(DAY_AVAILABILITES_KEY_FORM) as DailySchedule[] | undefined;

    // Initialize schedule if not exists
    useEffect(() => {
        if (!formSchedule || formSchedule.length === 0) {
            form.setValue(DAY_AVAILABILITES_KEY_FORM, createDefaultSchedule());
        }
        const message = verifyScheduleIntegrity();
        setError(message);
    }, [form, formSchedule]);

    const schedule = formSchedule || createDefaultSchedule();

    const verifyScheduleIntegrity = () => {
        const currentSchedule = form.getValues(DAY_AVAILABILITES_KEY_FORM) as DailySchedule[];
        let message: string = '';
        if (!currentSchedule) return message;
        for (const daySchedule of currentSchedule) {
            if (daySchedule.isActive) {
                // ensure daily schedules :
                // - availability ranges do not overlap
                // - startTime is before endTime

                const ranges = daySchedule.availabilityRanges;
                ranges.sort((a, b) => parseInt(a.startTime.replace(':', ''), 10) - parseInt(b.startTime.replace(':', ''), 10));

                for (let i = 0; i < ranges.length; i++) {
                    const rangeA = ranges[i];
                    const startA = parseInt(rangeA.startTime.replace(':', ''), 10); // base 10 : remove leading zeros : 09:00 -> 900
                    const endA = parseInt(rangeA.endTime.replace(':', ''), 10);

                    if (startA >= endA) {
                        message = `Time ranges on day ${daySchedule.dayOfWeek} overlap or are invalid.`;
                        return message;
                    }

                    // Check for overlaps with the next range
                    if (i < ranges.length - 1) {
                        const rangeB = ranges[i + 1];
                        const startB = parseInt(rangeB.startTime.replace(':', ''), 10);
                        if (endA > startB) {
                            message = `Time ranges on day ${daySchedule.dayOfWeek} overlap or are invalid.`;
                            return message;
                        }
                    }
                }
            }
        }
        return message;
    };

    const updateSchedule = (day: DayOfWeek, updater: (ds: DailySchedule) => DailySchedule) => {
        const currentSchedule = (form.getValues(DAY_AVAILABILITES_KEY_FORM) as DailySchedule[]) || createDefaultSchedule();
        const newSchedule = currentSchedule.map((ds) => (ds.dayOfWeek === day ? updater(ds) : ds));
        form.setValue(DAY_AVAILABILITES_KEY_FORM, newSchedule, { shouldValidate: true });
    };

    const toggleDay = (day: DayOfWeek) => {
        updateSchedule(day, (ds) => ({ ...ds, isActive: !ds.isActive }));
    };

    const addTimeSlot = (day: DayOfWeek, slot: { startTime: string; endTime: string }) => {
        updateSchedule(day, (ds) => ({
            ...ds,
            availabilityRanges: [
                ...ds.availabilityRanges,
                {
                    id: GenerateIdCrypto(),
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                },
            ],
        }));
    };

    const addCustomTimeSlot = (day: DayOfWeek) =>
        addTimeSlot(day, {
            startTime: '09:00',
            endTime: '10:00',
        });

    const updateTimeRange = (day: DayOfWeek, rangeId: string, field: 'startTime' | 'endTime', value: string) => {
        updateSchedule(day, (ds) => ({
            ...ds,
            availabilityRanges: ds.availabilityRanges.map((r: AvailabilityRangeType) => (r.id?.toString() === rangeId ? { ...r, [field]: value } : r)),
        }));
    };

    const removeTimeRange = (day: DayOfWeek, rangeId: string) => {
        updateSchedule(day, (ds) => ({
            ...ds,
            availabilityRanges: ds.availabilityRanges.filter((r) => r.id?.toString() !== rangeId),
        }));
    };

    const copyAvailability = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
        const source = schedule.find((s) => s.dayOfWeek === fromDay);
        if (!source) return;

        updateSchedule(toDay, (ds) => ({
            ...ds,
            isActive: true,
            availabilityRanges: source.availabilityRanges.map((r) => ({
                ...r,
                id: undefined,
            })),
        }));
        setSelectedCopySource(null);
    };

    const resetChanges = () => {
        form.setValue(DAY_AVAILABILITES_KEY_FORM, createDefaultSchedule());
        setSelectedCopySource(null);
    };

    const getScheduleSummary = () => {
        const enabledDays = schedule.filter((d) => d.isActive && d.availabilityRanges.length > 0);
        const totalSlots = enabledDays.reduce((sum, d) => sum + d.availabilityRanges.length, 0);
        return { enabledDays: enabledDays.length, totalSlots };
    };

    return {
        error,
        schedule,
        selectedCopySource,
        actions: {
            setSelectedCopySource,
            toggleDay,
            addTimeSlot,
            addCustomTimeSlot,
            updateTimeRange,
            removeTimeRange,
            copyAvailability,
            resetChanges,
        },
        getScheduleSummary,
    };
}
