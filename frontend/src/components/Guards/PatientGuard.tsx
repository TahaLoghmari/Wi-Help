import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { GetCurrentPatient } from "@/features/patient";
import { Spinner } from "@/components/ui";
import { useEffect } from "react";

export interface PatientGuardProps {
  children: React.ReactNode;
}

export function PatientGuard({ children }: PatientGuardProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isPatient = user?.role.toLowerCase() === "patient";

  const {
    data: patient,
    isLoading: isPatientLoading,
    isError,
  } = GetCurrentPatient();

  const { goToLogin, goToProfessionalApp } = useAppNavigation();

  useEffect(() => {
    if (!isUserLoading && !user) {
      goToLogin();
    } else if (user && !isPatient) {
      goToProfessionalApp();
    }
  }, [user, isUserLoading, isPatient, goToLogin, goToProfessionalApp]);

  if (isUserLoading || (isPatient && isPatientLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !isPatient) {
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
