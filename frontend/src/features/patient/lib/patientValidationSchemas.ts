import z from "zod";

const addressSchema = z.object({
  street: z
    .string()
    .min(1, { message: "Street is required." })
    .max(100, { message: "Street must be at most 100 characters." }),
  city: z
    .string()
    .min(1, { message: "City is required." })
    .max(50, { message: "City must be at most 50 characters." })
    .regex(/^[a-zA-Z\s']+$/, {
      message: "City must contain only letters, spaces, and apostrophes.",
    }),
  state: z
    .string()
    .min(1, { message: "State is required." })
    .max(50, { message: "State must be at most 50 characters." })
    .regex(/^[a-zA-Z\s']+$/, {
      message: "State must contain only letters, spaces, and apostrophes.",
    }),
  postalCode: z
    .string()
    .min(1, { message: "Postal Code is required." })
    .max(20, { message: "Postal Code must be at most 20 characters." }),
  country: z
    .string()
    .min(1, { message: "Country is required." })
    .max(50, { message: "Country must be at most 50 characters." }),
});

const emergencyContactSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full Name is required." })
    .max(100, { message: "Full Name must be at most 100 characters." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone Number is required." })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." }),
  relationship: z
    .string()
    .min(1, { message: "Relationship is required." })
    .max(50, { message: "Relationship must be at most 50 characters." }),
});

const medicalInfoSchema = z.object({
  chronicConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  mobilityStatus: z
    .enum(["Normal", "Limited", "Immobile"])
    .nullish()
    .or(z.literal("")),
});

export const profileAndBioFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required." })
    .max(50, { message: "First Name must be at most 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "First Name must contain only letters and spaces.",
    }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required." })
    .max(50, { message: "Last Name must be at most 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Last Name must contain only letters and spaces.",
    }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone Number is required." })
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number format." }),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  medicalInfo: medicalInfoSchema.nullish(),
  profilePicture: z.any().nullish(),
  bio: z
    .string()
    .max(1000, { message: "Bio must be at most 1000 characters." })
    .nullish(),
});

export const bookAppointmentFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().positive("Price must be a positive number"),
  urgency: z.enum(["Low", "Medium", "High"], {
    message: "Please select an urgency level",
  }),
  notes: z
    .string()
    .max(1000, "Notes cannot exceed 1000 characters.")
    .optional()
    .or(z.literal("")),
});
