import { useRouter } from "expo-router";
import { ROUTE_PATHS } from "@/config/routes";

export function useAppNavigation() {
  const router = useRouter();
  return {
    goToWelcome: () => router.replace(ROUTE_PATHS.WELCOME),
    goToLogin: () => router.push(ROUTE_PATHS.AUTH.LOGIN),
    goToRegister: () => router.push(ROUTE_PATHS.AUTH.REGISTER),
    goToProfessionalApp: () =>
      router.replace(ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS),
    goToPatientApp: () => router.replace(ROUTE_PATHS.PATIENT.APPOINTMENTS),
    goBack: () => router.back(),
  };
}
