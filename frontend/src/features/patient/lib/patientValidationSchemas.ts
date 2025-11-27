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
export const patientFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().positive("Price must be a positive number"),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});
export type SessionSlotType = z.infer<typeof sessionSlotSchema>;

export type BookingStep = z.infer<typeof bookingStepSchema>;

export type PatientFormState = z.infer<typeof patientFormSchema>;
