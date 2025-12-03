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
    state: "",
  },
};

export function PatientFormDefaults() {
  return {
    ...commonDefaults,
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
    specialization: "",
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
