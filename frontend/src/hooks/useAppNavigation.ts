import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";

export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goTo: navigate,

    goToLogin: (message?: string) => {
      navigate({
        to: ROUTE_PATHS.AUTH.LOGIN,
        search: { message: message || undefined },
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

    goToProfessionalApp: () => {
      navigate({ to: ROUTE_PATHS.PROFESSIONAL.ROOT });
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
