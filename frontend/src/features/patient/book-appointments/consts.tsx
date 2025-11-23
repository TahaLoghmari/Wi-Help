import z from "zod";

export const sessionSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  isAvailable: z.boolean(),
  isBooked: z.boolean(),
});
export const bookingStepSchema = z.enum([
  "select",
  "confirm",
  "success",
  "error",
]);
export const bookingHookStateSchema = z.object({
  selectedDate: z.date().optional(),
  selectedSlot: sessionSlotSchema.nullable(),
  step: bookingStepSchema,
  price: z.number().positive("Price must be a positive number"),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});
export type SessionSlotType = z.infer<typeof sessionSlotSchema>;

export type BookingStep = z.infer<typeof bookingStepSchema>;

export type BookingHookState = z.infer<typeof bookingHookStateSchema>;
