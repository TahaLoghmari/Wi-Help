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
  postalCode: z
    .string()
    .min(1, { message: "Postal Code is required." })
    .max(20, { message: "Postal Code must be at most 20 characters." }),
  countryId: z.string().min(1, { message: "Country is required." }),
  stateId: z.string().min(1, { message: "State is required." }),
});

const emergencyContactSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Emergency Contact Name is required." })
    .max(100, {
      message: "Emergency Contact Name must be at most 100 characters.",
    }),
  phoneNumber: z
    .string()
    .min(1, { message: "Emergency Contact Phone Number is required." })
    .max(20, {
      message: "Emergency Contact Phone Number must be at most 20 characters.",
    })
    .regex(/^\+?[\d\s\-()]+$/, {
      message: "Please enter a valid phone number.",
    }),
  relationshipId: z.string().min(1, { message: "Relationship is required." }),
});

const commonFields = {
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
  dateOfBirth: z
    .string()
    .min(1, { message: "Date of Birth is required." })
    .refine(
      (date) => {
        const parts = date.split("/");
        if (parts.length !== 3) return false;
        const [day, month, year] = parts.map(Number);
        if (!day || !month || !year || year < 1000) return false;
        const selectedDate = new Date(year, month - 1, day);
        return !isNaN(selectedDate.getTime()) && selectedDate <= new Date();
      },
      { message: "Date of Birth cannot be in the future." },
    ),
  gender: z
    .string()
    .min(1, { message: "Gender is required." })
    .max(10, { message: "Gender must be at most 10 characters." }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone Number is required." })
    .max(20, { message: "Phone Number must be at most 20 characters." })
    .regex(/^\+?[\d\s\-()]+$/, {
      message: "Please enter a valid phone number.",
    }),
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, { message: "Email is required." })
    .max(256, { message: "Email must be at most 256 characters." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password must be at most 100 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter (A-Z).",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter (a-z).",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one digit (0-9).",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one non-alphanumeric character.",
    }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirmation password is required." }),
  address: addressSchema,
};

export const patientSchema = z
  .object({
    ...commonFields,
    emergencyContact: emergencyContactSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export const professionalSchema = z
  .object({
    ...commonFields,
    specializationId: z
      .string()
      .min(1, { message: "Specialization is required." }),
    experience: z
      .number()
      .min(0, { message: "Years of Experience must be at least 0." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export const registerFormSchema = z.union([patientSchema, professionalSchema]);

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address." })
    .min(1, { message: "Email is required." })
    .max(256, { message: "Email must be at most 256 characters." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type PatientFormValues = z.infer<typeof patientSchema>;
export type ProfessionalFormValues = z.infer<typeof professionalSchema>;
