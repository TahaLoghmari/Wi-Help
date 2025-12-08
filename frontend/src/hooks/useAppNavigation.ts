import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goTo: navigate,

    goToBook: (professionalId: string) => {
      navigate({
        to: ROUTE_PATHS.PATIENT.BOOK,
        params: { professionalId },
      });
    },

    goToLogin: () => {
      navigate({
        to: ROUTE_PATHS.AUTH.LOGIN,
      });
    },

    goToRegister: () => {
      navigate({ to: ROUTE_PATHS.AUTH.REGISTER });
    },

    goToForgotPassword: (email?: string) => {
      navigate({
        to: ROUTE_PATHS.AUTH.FORGOT_PASSWORD,
        search: { email: email || undefined },
      });
    },

    goToResetPassword: (params: { email: string; token: string }) => {
      navigate({
        to: ROUTE_PATHS.AUTH.RESET_PASSWORD,
        search: params,
      });
    },

    goToEmailVerification: (email: string) => {
      navigate({
        to: ROUTE_PATHS.AUTH.EMAIL_VERIFICATION,
        search: { email },
      });
    },

    goToHome: () => {
      navigate({ to: ROUTE_PATHS.ROOT });
    },

    goToAdminApp: () => {
      navigate({ to: ROUTE_PATHS.ADMIN.ROOT });
    },

    goToProfessionalApp: () => {
      navigate({ to: ROUTE_PATHS.PROFESSIONAL.ROOT });
    },

    goToProfessionalMessaging: () => {
      navigate({ to: ROUTE_PATHS.PROFESSIONAL.MESSAGES });
    },

    goToPatientApp: () => {
      navigate({ to: ROUTE_PATHS.PATIENT.ROOT });
    },

    goToBookingSuccess: () => {
      navigate({ to: ROUTE_PATHS.PATIENT.BOOK_SUCCESS });
    },

    goToPatientProfile: (patientId: string) => {
      navigate({
        to: ROUTE_PATHS.PROFESSIONAL.PATIENT_PROFILE,
        params: { patientId },
      });
    },

    goToProfessionalProfile: (professionalId: string) => {
      navigate({
        to: ROUTE_PATHS.PATIENT.PROFESSIONAL_PROFILE,
        params: { professionalId },
      });
    },

    goBack: () => {
      window.history.back();
    },

    goToExternal: (url: string, newTab = false) => {
      if (newTab) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    },
  };
}
