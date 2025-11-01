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
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      phoneNumber: "",
      relationship: "",
    },
    workplace: {
      streetAddress: "",
      city: "",
      postalCode: "",
      country: "",
    },
    specialization: "",
    yearsOfExperience: "",
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
