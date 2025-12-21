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
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

export interface EmergencyContact {
  fullName: string;
  phoneNumber: string;
  relationship: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface RegisterProfessionalDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address?: Address;
  specialization?: string;
  experience?: number;
}

export interface RegisterPatientDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  role: string;
  address?: Address;
  emergencyContact?: EmergencyContact;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordState {
  hasClickedResetPassword: boolean;
  email: string;
  setResetPasswordClicked: (email: string) => void;
  clearResetState: () => void;
}

export interface GoogleAuthResponseDto {
  authorizationUrl: string;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}
