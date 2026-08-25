import type { Address, LocationCoordinates } from "@/entities/location";

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: Address;
  profilePictureUrl: string;
  role: string;
  location?: LocationCoordinates | null;
  isOnboardingCompleted: boolean;
}

export type AuthorizedSessionRole = "Patient" | "Professional" | "Admin";
export type SessionRole = AuthorizedSessionRole | "Unknown";
export type CurrentUserDto = Omit<UserDto, "role"> & {
  role: SessionRole;
};
