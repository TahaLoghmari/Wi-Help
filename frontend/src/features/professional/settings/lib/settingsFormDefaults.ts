import type { ProfessionalDto } from "../../types";

export function ProfileAndBioFormDefaults(professional: ProfessionalDto) {
  return {
    firstName: professional.firstName,
    lastName: professional.lastName,
    phoneNumber: professional.phoneNumber,
    experience: professional.experience,
    address: {
      street: professional.address.street,
      city: professional.address.city,
      state: professional.address.state,
      postalCode: professional.address.postalCode,
      country: professional.address.country,
    },
    specialization: professional.specialization,
    services: professional.services,
    startPrice: professional.startPrice,
    endPrice: professional.endPrice,
    bio: professional.bio,
  };
}
