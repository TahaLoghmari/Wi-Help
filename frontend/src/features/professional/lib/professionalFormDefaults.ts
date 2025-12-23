import type { ProfessionalDto } from "@/features/professional";

export function ProfileAndBioFormDefaults(professional: ProfessionalDto) {
  return {
    firstName: professional.firstName,
    lastName: professional.lastName,
    phoneNumber: professional.phoneNumber,
    experience: professional.experience,
    address: professional.address,
    specialization: professional.specialization,
    services: professional.services,
    visitPrice: professional.visitPrice,
    bio: professional.bio,
    profilePicture: undefined,
  };
}
