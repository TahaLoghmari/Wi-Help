import type { ProfessionalDto } from "@/features/professional";

export function ProfileAndBioFormDefaults(professional: ProfessionalDto) {
  return {
    firstName: professional.firstName,
    lastName: professional.lastName,
    phoneNumber: professional.phoneNumber,
    experience: professional.experience,
    address: professional.address,
    specializationId: professional.specialization?.id ?? "",
    visitPrice: professional.visitPrice,
    bio: professional.bio,
    profilePicture: undefined,
    serviceIds: professional.services?.map((s) => s.id) ?? [],
  };
}
