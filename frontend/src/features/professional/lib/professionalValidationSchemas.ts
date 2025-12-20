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
  postalCode: z
    .string()
    .min(1, { message: "Postal Code is required." })
    .max(20, { message: "Postal Code must be at most 20 characters." }),
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
      .max(50, { message: "First Name must be at most 50 characters." })
      .regex(/^[a-zA-Z]+$/, {
        message: "First Name must contain only letters.",
      }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required." })
      .max(50, { message: "Last Name must be at most 50 characters." })
      .regex(/^[a-zA-Z]+$/, {
        message: "Last Name must contain only letters.",
      }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone Number is required." })
      .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." }),
    experience: z
      .number({ message: "Years of experience must be a number." })
      .int({ message: "Experience must be a whole number." })
      .nonnegative({ message: "Experience cannot be negative." }),
    address: addressSchema,
    profilePicture: z.any().nullish(),
    specialization: z
      .string()
      .min(1, { message: "Specialization is required." })
      .max(50, { message: "Specialization must be at most 50 characters." }),
    services: z.array(z.string()).nullish(),
    startPrice: z
      .number({ message: "Start price must be a number." })
      .nonnegative({ message: "Start price cannot be negative." }),
    endPrice: z
      .number({ message: "End price must be a number." })
      .nonnegative({ message: "End price cannot be negative." }),
    bio: z
      .string()
      .max(1000, { message: "Bio must be at most 1000 characters." })
      .nullish(),
  })
  .refine(
    (data) => {
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
