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
    .regex(/^[a-zA-Z]+$/, { message: "City must contain only letters." }),
  postalCode: z
    .string()
    .min(1, { message: "Postal Code is required." })
    .max(20, { message: "Postal Code must be at most 20 characters." }),
  country: z
    .string()
    .min(1, { message: "Country is required." })
    .max(50, { message: "Country must be at most 50 characters." }),
  state: z
    .string()
    .min(1, { message: "State is required." })
    .max(50, { message: "State must be at most 50 characters." })
    .regex(/^[a-zA-Z]+$/, { message: "City must contain only letters." }),
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

const commonFields = {
  firstName: z
    .string()
    .min(1, { message: "First Name is required." })
    .max(50, { message: "First Name must be at most 50 characters." })
    .regex(/^[a-zA-Z]+$/, { message: "First Name must contain only letters." }),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required." })
    .max(50, { message: "Last Name must be at most 50 characters." })
    .regex(/^[a-zA-Z]+$/, { message: "Last Name must contain only letters." }),
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
    specialization: z
      .string()
      .min(1, { message: "Specialization is required." })
      .max(100, { message: "Specialization must be at most 100 characters." }),
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

export const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required." }),
    newPassword: z
      .string()
      .min(1, { message: "New password is required." })
      .min(6, { message: "New password must be at least 6 characters long." })
      .max(100, {
        message: "New password must be at most 100 characters long.",
      })
      .regex(/[A-Z]/, {
        message:
          "New password must contain at least one uppercase letter (A-Z).",
      })
      .regex(/[a-z]/, {
        message:
          "New password must contain at least one lowercase letter (a-z).",
      })
      .regex(/[0-9]/, {
        message: "New password must contain at least one digit (0-9).",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          "New password must contain at least one non-alphanumeric character.",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirmation password is required." }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirmation password do not match.",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });
