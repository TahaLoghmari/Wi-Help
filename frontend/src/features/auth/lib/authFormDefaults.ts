export function LoginFormDefaults() {
  return {
    email: "",
    password: "",
  };
}

const commonDefaults = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  address: {
    street: "",
    city: "",
    postalCode: "",
    country: "",
  },
};

export function PatientFormDefaults() {
  return {
    ...commonDefaults,
    role: "patient" as const,
    emergencyContact: {
      fullName: "",
      phoneNumber: "",
      relationship: "",
    },
  };
}

export function ProfessionalFormDefaults() {
  return {
    ...commonDefaults,
    role: "professional" as const,
    specialization: "",
    yearsOfExperience: undefined as number | undefined,
  };
}

export function ForgotPasswordDefautls() {
  return {
    email: "",
  };
}

export function ResetPasswordDefaults(email: string) {
  return {
    email: email,
    password: "",
    confirmPassword: "",
  };
}
