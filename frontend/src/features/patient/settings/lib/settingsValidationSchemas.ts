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
  chronicConditions: z.array(z.string()),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  mobilityStatus: z.enum(["Normal", "Limited", "Immobile"]),
});

export const profileAndBioFormSchema = z.object({
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
  address: addressSchema.optional(),
  emergencyContact: emergencyContactSchema.optional(),
  medicalInfo: medicalInfoSchema.optional(),
  profilePicture: z.file().optional(),
  bio: z
    .string()
    .max(1000, { message: "Bio must be at most 1000 characters." })
    .optional(),
});
