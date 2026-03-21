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
    countryId: "",
    stateId: "",
  },
};

export function PatientFormDefaults() {
  return {
    ...commonDefaults,
    emergencyContact: {
      fullName: "",
      phoneNumber: "",
      relationshipId: "",
    },
  };
}

export function ProfessionalFormDefaults() {
  return {
    ...commonDefaults,
    specializationId: "",
    experience: 0,
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

export function ChangePasswordDefaults() {
  return {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };
}

// Onboarding form defaults (for Google OAuth users)
export function PatientOnboardingDefaults() {
  return {
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      countryId: "",
      stateId: "",
    },
    emergencyContact: {
      fullName: "",
      phoneNumber: "",
      relationshipId: "",
    },
  };
}

export function ProfessionalOnboardingDefaults() {
  return {
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      countryId: "",
      stateId: "",
    },
    specializationId: "",
    experience: 0,
  };
}
