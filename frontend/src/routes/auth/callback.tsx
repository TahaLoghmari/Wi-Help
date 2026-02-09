import { ROUTE_PATHS } from "@/config/routes";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Spinner } from "@/components/ui";
import { useCurrentUser } from "@/features/auth";
import { PatientOnboarding } from "@/features/auth/components/Onboarding/PatientOnboarding";
import { ProfessionalOnboarding } from "@/features/auth/components/Onboarding/ProfessionalOnboarding";

interface CallbackSearch {
  onboarding?: boolean;
  role?: string;
  error?: string;
  message?: string;
}

export const Route = createFileRoute("/auth/callback")({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => {
    return {
      onboarding: search.onboarding === true || search.onboarding === "true",
      role: (search.role as string) || undefined,
      error: (search.error as string) || undefined,
      message: (search.message as string) || undefined,
    };
  },
  component: CallbackPage,
});

function CallbackPage() {
  const search = useSearch({ from: "/auth/callback" });
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useCurrentUser();

  // Tracks whether the onboarding form was rendered on this page visit.
  // When set, the mutation's onSuccess handles navigation — not the useEffect.
  const isOnboardingActive = useRef(false);

  // Track if we've already initiated navigation to prevent duplicate navigations
  const hasNavigated = useRef(false);

  useEffect(() => {
    // If the onboarding form was shown on this page, the completion
    // mutation handles navigation — skip to avoid a double-navigate race.
    if (isOnboardingActive.current) return;

    // If we've already navigated, don't navigate again
    if (hasNavigated.current) return;

    // Handle error from Google OAuth
    if (search.error) {
      hasNavigated.current = true;
      navigate({
        to: ROUTE_PATHS.AUTH.LOGIN,
        search: { message: search.message },
      });
      return;
    }

    // Wait for user data to load
    if (isLoading) return;

    // If there's an error fetching user, redirect to login
    if (isError || !user) {
      hasNavigated.current = true;
      navigate({ to: ROUTE_PATHS.AUTH.LOGIN });
      return;
    }

    // If onboarding is needed, the user stays on this page which will render the onboarding form
    if (search.onboarding && !user.isOnboardingCompleted) {
      // User needs to complete onboarding - stay here
      return;
    }

    // Otherwise, redirect to appropriate app
    hasNavigated.current = true;
    if (user.role.toLowerCase() === "admin") {
      navigate({ to: ROUTE_PATHS.ADMIN.APPOINTMENTS });
    } else if (user.role.toLowerCase() === "professional") {
      navigate({ to: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS });
    } else {
      navigate({ to: ROUTE_PATHS.PATIENT.APPOINTMENTS });
    }
  }, [user, isLoading, isError, search, navigate]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // If onboarding is needed, render the onboarding component.
  // Keep rendering it while the completion mutation finishes (isOnboardingActive stays
  // true until the mutation navigates away), preventing a flash to a spinner.
  if (
    search.onboarding &&
    user &&
    (!user.isOnboardingCompleted || isOnboardingActive.current)
  ) {
    isOnboardingActive.current = true;
    return <OnboardingRouter role={search.role || user.role.toLowerCase()} />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

function OnboardingRouter({ role }: { role: string }) {
  if (role === "patient") {
    return <PatientOnboarding />;
  }
  return <ProfessionalOnboarding />;
}
