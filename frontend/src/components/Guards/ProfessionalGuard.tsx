import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { useCurrentProfessional } from "@/features/professional";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export interface ProfessionalGuardProps {
  children: React.ReactNode;
}

export function ProfessionalGuard({ children }: ProfessionalGuardProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isProfessional = user?.role.toLowerCase() === "professional";

  const {
    data: professional,
    isLoading: isProfessionalLoading,
    isError,
  } = useCurrentProfessional(!!user && isProfessional);

  const { goToLogin, goToPatientApp } = useAppNavigation();

  useEffect(() => {
    if (!isUserLoading && !user) {
      goToLogin();
    } else if (user && !isProfessional) {
      goToPatientApp();
    }
  }, [user, isUserLoading, isProfessional, goToLogin, goToPatientApp]);

  if (isUserLoading || (isProfessional && isProfessionalLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !isProfessional) {
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
