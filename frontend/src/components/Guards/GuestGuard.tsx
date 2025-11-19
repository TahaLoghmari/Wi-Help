import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { goToProfessionalApp, goToPatientApp } = useAppNavigation();

  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === "professional") {
        goToProfessionalApp();
      } else if (user.role.toLowerCase() === "patient") {
        goToPatientApp();
      }
    }
  }, [user, goToProfessionalApp, goToPatientApp]);

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
