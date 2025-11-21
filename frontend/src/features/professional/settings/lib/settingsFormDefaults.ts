import type { UserDto } from "@/features/auth";

export function ProfileAndBioFormDefaults(user: UserDto) {
  return {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    experience: 0,
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
    },
    specialization: "",
    services: [] as string[],
    startPrice: 0,
    endPrice: 0,
    bio: "",
  };
}
