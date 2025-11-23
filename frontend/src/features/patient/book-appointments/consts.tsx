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
  title: z
    .string()
    .max(1000, "Title cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address."),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters."),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number."),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional(),
});
export type SessionSlotType = z.infer<typeof sessionSlotSchema>;

export type BookingStep = z.infer<typeof bookingStepSchema>;

export type BookingHookState = z.infer<typeof bookingHookStateSchema>;
