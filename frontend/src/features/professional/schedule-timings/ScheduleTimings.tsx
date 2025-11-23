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

