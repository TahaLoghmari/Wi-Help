export function LoginFormDefaults() {
  return {
    email: "",
    password: "",
  };
}

export function RegisterFormDefaults() {
  return {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    role: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
    emergencyContact: {
      fullName: "",
      phoneNumber: "",
      relationship: "",
    },
    workplace: {
      street: "",
      city: "",
      postalCode: "",
      country: "",
    },
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
