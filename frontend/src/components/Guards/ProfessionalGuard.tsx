import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { GetCurrentProfessional } from "@/features/professional";
import { Spinner } from "@/components/ui";
import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config";

export interface ProfessionalGuardProps {
  children: React.ReactNode;
}

export function ProfessionalGuard({ children }: ProfessionalGuardProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isProfessional = user?.role.toLowerCase() === "professional";
  const location = useLocation();

  const {
    data: professional,
    isLoading: isProfessionalLoading,
    isError,
  } = GetCurrentProfessional();

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
    } else if (user && !isProfessional) {
      // Only navigate if not already on patient route
      if (!location.pathname.startsWith("/patient")) {
        hasNavigated.current = true;
        goTo({ to: ROUTE_PATHS.PATIENT.APPOINTMENTS });
      }
    }
  }, [
    user,
    isUserLoading,
    isProfessional,
    goToLogin,
    goToOnboarding,
    goTo,
    location.pathname,
  ]);

  if (isUserLoading || (isProfessional && isProfessionalLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !isProfessional || !user.isOnboardingCompleted) {
    return null;
  }

  if (isError || !professional) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>
          Error loading professional profile. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
