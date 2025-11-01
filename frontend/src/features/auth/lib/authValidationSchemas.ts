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
  postalCode: z
    .string()
    .min(1, { message: "Postal Code is required." })
    .max(20, { message: "Postal Code must be at most 20 characters." }),
  country: z
    .string()
    .min(1, { message: "Country is required." })
    .max(50, { message: "Country must be at most 50 characters." }),
});

const workplaceSchema = z.object({
  street: z
    .string()
    .max(100, { message: "Street must be at most 100 characters." }),
  city: z.string().max(50, { message: "City must be at most 50 characters." }),
  postalCode: z
    .string()
    .max(20, { message: "Postal Code must be at most 20 characters." }),
  country: z
    .string()
    .max(50, { message: "Country must be at most 50 characters." }),
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
  relationship: z
    .string()
    .min(1, { message: "Relationship is required." })
    .max(50, { message: "Relationship must be at most 50 characters." }),
});

export const registerFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "First Name is required." })
      .max(50, { message: "First Name must be at most 50 characters." }),
    lastName: z
      .string()
      .min(1, { message: "Last Name is required." })
      .max(50, { message: "Last Name must be at most 50 characters." }),
    dateOfBirth: z
      .string()
      .min(1, { message: "Date of Birth is required." })
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          return selectedDate <= today;
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
      .email()
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
        message:
          "Password must contain at least one non-alphanumeric character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmation password is required." }),
    role: z.string().min(1, { message: "Role is required." }),
    address: addressSchema.optional(),
    emergencyContact: emergencyContactSchema.optional(),
    workplace: workplaceSchema.optional(),
    specialization: z
      .string()
      .max(100, { message: "Specialization must be at most 100 characters." })
      .optional(),
    yearsOfExperience: z.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "patient") {
        return !!data.address;
      }
      return true;
    },
    {
      message: "Address is required for patients.",
      path: ["address"],
    },
  )
  .refine(
    (data) => {
      if (data.role === "patient") {
        return !!data.emergencyContact;
      }
      return true;
    },
    {
      message: "Emergency Contact is required for patients.",
      path: ["emergencyContact"],
    },
  )
  .refine(
    (data) => {
      if (data.role === "professional") {
        return !!data.specialization && data.specialization.trim().length > 0;
      }
      return true;
    },
    {
      message: "Specialization is required for professionals.",
      path: ["specialization"],
    },
  )
  .refine(
    (data) => {
      if (data.role === "professional") {
        return (
          !!data.workplace &&
          !!data.workplace.street &&
          data.workplace.street.trim().length > 0 &&
          !!data.workplace.city &&
          data.workplace.city.trim().length > 0 &&
          !!data.workplace.postalCode &&
          data.workplace.postalCode.trim().length > 0 &&
          !!data.workplace.country &&
          data.workplace.country.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Workplace is required for professionals.",
      path: ["workplace"],
    },
  )
  .refine(
    (data) => {
      if (data.role === "professional") {
        return (
          data.yearsOfExperience !== undefined &&
          data.yearsOfExperience !== null &&
          typeof data.yearsOfExperience === "number" &&
          data.yearsOfExperience >= 0
        );
      }
      return true;
    },
    {
      message: "Years of Experience is required for professionals.",
      path: ["yearsOfExperience"],
    },
  );

export const loginFormSchema = z.object({
  email: z
    .email()
    .min(1, { message: "Email is required." })
    .max(256, { message: "Email must be at most 256 characters." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export const resetPasswordFormSchema = z
  .object({
    email: z
      .email()
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
        message:
          "Password must contain at least one non-alphanumeric character.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmation password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmation password do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordFormSchema = z.object({
  email: z
    .email()
    .min(1, { message: "Email is required." })
    .max(256, { message: "Email must be at most 256 characters." }),
});
