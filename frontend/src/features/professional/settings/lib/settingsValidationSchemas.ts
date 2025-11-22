import z from "zod";

const addressSchema = z.object({
  street: z
    .string()
    .max(100, { message: "Street must be at most 100 characters." })
    .optional(),
  city: z
    .string()
    .max(50, { message: "City must be at most 50 characters." })
    .optional(),
  state: z
    .string()
    .max(50, { message: "State must be at most 50 characters." })
    .optional(),
  postalCode: z
    .string()
    .max(20, { message: "Postal Code must be at most 20 characters." })
    .optional(),
  country: z
    .string()
    .max(50, { message: "Country must be at most 50 characters." })
    .optional(),
});

export const profileAndBioFormSchema = z
  .object({
    firstName: z
      .string()
      .max(50, { message: "First Name must be at most 50 characters." })
      .regex(/^[a-zA-Z]+$/, {
        message: "First Name must contain only letters.",
      })
      .optional(),
    lastName: z
      .string()
      .max(50, { message: "Last Name must be at most 50 characters." })
      .regex(/^[a-zA-Z]+$/, { message: "Last Name must contain only letters." })
      .optional(),
    phoneNumber: z
      .string()
      .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." })
      .optional(),
    experience: z
      .number({ message: "Years of experience must be a number." })
      .int({ message: "Experience must be a whole number." })
      .nonnegative({ message: "Experience cannot be negative." })
      .optional(),
    address: addressSchema.optional(),
    specialization: z
      .string()
      .max(50, { message: "Specialization must be at most 50 characters." })
      .optional(),
    services: z.array(z.string()).optional(),
    startPrice: z
      .number({ message: "Start price must be a number." })
      .nonnegative({ message: "Start price cannot be negative." })
      .optional(),
    endPrice: z
      .number({ message: "End price must be a number." })
      .nonnegative({ message: "End price cannot be negative." })
      .optional(),
    bio: z
      .string()
      .max(1000, { message: "Bio must be at most 1000 characters." })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startPrice == null || data.endPrice == null) return true;
      return data.endPrice >= data.startPrice;
    },
    {
      message: "End price must be greater than or equal to start price.",
      path: ["endPrice"],
    },
  );
