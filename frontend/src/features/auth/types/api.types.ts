export interface User {
  id: string;
  email: string;
  googleEmail: string;
  name: string;
  imageUrl: string;
  gmailConnected: boolean;
  emailConfirmed?: boolean;
  isInitialSyncComplete: boolean;
  hasPassword: boolean;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
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
