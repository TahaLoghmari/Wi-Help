import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui/spinner";

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { goToProfessionalApp } = useAppNavigation();

  if (isError) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (user) goToProfessionalApp();

  return <>{children}</>;
}
