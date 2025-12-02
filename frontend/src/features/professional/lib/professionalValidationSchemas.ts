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
    profilePicture: z.file().optional(),
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

// Award validation schema
export const awardFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(200, { message: "Title must be at most 200 characters." }),
  issuer: z
    .string()
    .max(200, { message: "Issuer must be at most 200 characters." })
    .optional()
    .nullable(),
  description: z
    .string()
    .max(1000, { message: "Description must be at most 1000 characters." })
    .optional()
    .nullable(),
  yearReceived: z
    .string()
    .min(1, { message: "Year received is required." })
    .regex(/^\d{4}$/, { message: "Year must be a 4-digit number." })
    .refine((year) => parseInt(year) <= new Date().getFullYear(), {
      message: "Year received cannot be in the future.",
    }),
});

// Education validation schema
export const educationFormSchema = z.object({
  institution: z
    .string()
    .min(1, { message: "Institution is required." })
    .max(300, { message: "Institution must be at most 300 characters." }),
  degree: z
    .string()
    .min(1, { message: "Degree is required." })
    .max(200, { message: "Degree must be at most 200 characters." }),
  fieldOfStudy: z
    .string()
    .max(200, { message: "Field of study must be at most 200 characters." })
    .optional()
    .nullable(),
  country: z
    .string()
    .max(100, { message: "Country must be at most 100 characters." })
    .optional()
    .nullable(),
  startYear: z
    .string()
    .min(1, { message: "Start year is required." })
    .max(10, { message: "Start year must be at most 10 characters." }),
  endYear: z
    .string()
    .max(10, { message: "End year must be at most 10 characters." })
    .optional()
    .nullable(),
  isCurrentlyStudying: z.boolean(),
});

// Experience validation schema
export const experienceFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required." })
    .max(200, { message: "Title must be at most 200 characters." }),
  organization: z
    .string()
    .min(1, { message: "Organization is required." })
    .max(300, { message: "Organization must be at most 300 characters." }),
  location: z
    .string()
    .max(200, { message: "Location must be at most 200 characters." })
    .optional()
    .nullable(),
  description: z
    .string()
    .max(1000, { message: "Description must be at most 1000 characters." })
    .optional()
    .nullable(),
  startYear: z
    .string()
    .min(1, { message: "Start year is required." })
    .max(10, { message: "Start year must be at most 10 characters." }),
  endYear: z
    .string()
    .max(10, { message: "End year must be at most 10 characters." })
    .optional()
    .nullable(),
  isCurrentPosition: z.boolean(),
});

const availabilitySlotSchema = z.object({
  id: z.string().optional().nullable(),
  startTime: z.string(),
  endTime: z.string(),
});

const dayAvailabilitySchema = z.object({
  dayOfWeek: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  isActive: z.boolean(),
  availabilitySlots: z.array(availabilitySlotSchema),
});

export const scheduleFormSchema = z.object({
  days: z.array(dayAvailabilitySchema),
});
