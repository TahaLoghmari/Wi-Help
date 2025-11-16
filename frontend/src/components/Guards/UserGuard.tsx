import { useAppNavigation } from "@/hooks";
import { useCurrentUser } from "@/features/auth";
import { Spinner } from "@/components/ui/spinner";

export interface UserGuardProps {
  children: React.ReactNode;
}

export function UserGuard({ children }: UserGuardProps) {
  const { data: user, isPending, isError } = useCurrentUser();
  const { goToLogin } = useAppNavigation();
  if (isPending && !isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user || isError) {
    goToLogin();
  }

  return <>{children}</>;
}
