import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export interface UserGuardProps {
  children: React.ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const { data: user, isPending, isError } = useCurrentUser();
  const { goToLogin } = useAppNavigation();

  useEffect(() => {
    if (!isPending && (!user || isError)) {
      goToLogin();
    }
  }, [user, isError, isPending, goToLogin]);

  if (!user || isError) {
    return null;
  }

  if (isPending && !isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
