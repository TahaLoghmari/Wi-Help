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
