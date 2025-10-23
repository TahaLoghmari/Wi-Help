export function LoginFormDefaults() {
  return {
    email: "",
    password: "",
  };
}

export function RegisterFormDefaults() {
  return {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
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
