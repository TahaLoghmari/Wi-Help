import z from "zod";

const addressSchema = z.object({
  street: z
    .string()
    .min(1, { message: "Street is required." })
    .max(100, { message: "Street must be at most 100 characters." }),
  city: z
    .string()
    .min(1, { message: "City is required." })
    .max(50, { message: "City must be at most 50 characters." }),
  state: z
    .string()
    .min(1, { message: "State is required." })
    .max(50, { message: "State must be at most 50 characters." }),
  country: z
    .string()
    .min(1, { message: "Country is required." })
    .max(50, { message: "Country must be at most 50 characters." }),
});

export const profileAndBioFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is required." })
      .max(50, { message: "First Name must be at most 50 characters." }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required." })
      .max(50, { message: "Last Name must be at most 50 characters." }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." }),
    experience: z
      .number({ message: "Years of experience is required." })
      .int({ message: "Experience must be a whole number." })
      .nonnegative({ message: "Experience cannot be negative." }),
    address: addressSchema,
    specialization: z
      .string()
      .min(1, { message: "Specialization is required." })
      .max(50, { message: "Specialization must be at most 50 characters." }),
    services: z
      .array(z.string())
      .min(1, { message: "At least one service is required." }),
    startPrice: z
      .number({ message: "Start price is required." })
      .nonnegative({ message: "Start price cannot be negative." }),
    endPrice: z
      .number({ message: "End price is required." })
      .nonnegative({ message: "End price cannot be negative." }),
    bio: z
      .string()
      .min(1, { message: "Bio is required." })
      .max(1000, { message: "Bio must be at most 1000 characters." }),
  })
  .refine((data) => data.endPrice >= data.startPrice, {
    message: "End price must be greater than or equal to start price.",
    path: ["endPrice"],
  });
