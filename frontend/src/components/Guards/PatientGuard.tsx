import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { GetCurrentPatient } from "@/features/patient";
import { Spinner } from "@/components/ui";
import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config";

export interface PatientGuardProps {
  children: React.ReactNode;
}

export function PatientGuard({ children }: PatientGuardProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isPatient = user?.role.toLowerCase() === "patient";
  const location = useLocation();

  const {
    data: patient,
    isLoading: isPatientLoading,
    isError,
  } = GetCurrentPatient();

  const { goToLogin, goToOnboarding, goTo } = useAppNavigation();

  // Prevent duplicate navigation attempts
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (hasNavigated.current) return;

    if (!isUserLoading && !user) {
      hasNavigated.current = true;
      goToLogin();
    } else if (user && !user.isOnboardingCompleted) {
      // Redirect to onboarding if not completed
      hasNavigated.current = true;
      goToOnboarding(user.role.toLowerCase());
    } else if (user && !isPatient) {
      // Only navigate if not already on professional route
      if (!location.pathname.startsWith("/professional")) {
        hasNavigated.current = true;
        goTo({ to: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS });
      }
    }
  }, [
    user,
    isUserLoading,
    isPatient,
    goToLogin,
    goToOnboarding,
    goTo,
    location.pathname,
  ]);

  if (isUserLoading || (isPatient && isPatientLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !isPatient || !user.isOnboardingCompleted) {
    return null;
  }

  if (isError || !patient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Error loading patient profile. Please try refreshing the page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
