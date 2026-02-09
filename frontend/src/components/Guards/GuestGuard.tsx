import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui";
import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { goToProfessionalApp, goToPatientApp, goToAdminApp, goToOnboarding } =
    useAppNavigation();
  const location = useLocation();

  // The callback route handles its own auth logic (Google OAuth return + onboarding)
  const isCallbackRoute = location.pathname === ROUTE_PATHS.AUTH.CALLBACK;

  useEffect(() => {
    // Skip redirect logic for the callback route — it manages navigation itself
    if (isCallbackRoute) return;

    if (user) {
      // If onboarding is not completed, redirect to onboarding
      if (!user.isOnboardingCompleted) {
        goToOnboarding(user.role.toLowerCase());
        return;
      }

      if (user.role.toLowerCase() === "admin") {
        goToAdminApp();
      } else if (user.role.toLowerCase() === "professional") {
        goToProfessionalApp();
      } else if (user.role.toLowerCase() === "patient") {
        goToPatientApp();
      }
    }
  }, [
    user,
    isCallbackRoute,
    goToProfessionalApp,
    goToPatientApp,
    goToAdminApp,
    goToOnboarding,
  ]);

  // Allow callback route through — it renders its own content
  if (isCallbackRoute) return <>{children}</>;

  if (user) return null;
  if (isError) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
