export interface User {
  id: string;
  email: string;
  userName: string;
  imageUrl: string;
  emailConfirmed?: boolean;
  role: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
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

export interface RegisterUserDto {
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
  specialization?: string;
  yearsOfExperience?: number;
}

export interface ResetPasswordDto {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
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
