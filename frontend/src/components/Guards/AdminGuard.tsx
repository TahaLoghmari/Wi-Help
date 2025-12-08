import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui";
import { useEffect } from "react";

export interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isAdmin = user?.role.toLowerCase() === "admin";

  const { goToLogin, goToPatientApp } = useAppNavigation();

  useEffect(() => {
    if (!isUserLoading && !user) {
      goToLogin();
    } else if (user && !isAdmin) {
      goToPatientApp();
    }
  }, [user, isUserLoading, isAdmin, goToLogin, goToPatientApp]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
