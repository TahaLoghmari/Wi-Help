import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type CompletePatientOnboardingDto,
  type CompleteProfessionalOnboardingDto,
} from "@/features/auth";
import { handleApiError, api, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { useNavigate } from "@tanstack/react-router";
import { ROUTE_PATHS } from "@/config/routes";
import { env } from "@/config/env";

export const completePatientOnboarding = (
  data: CompletePatientOnboardingDto,
) => {
  return api.post<void>(API_ENDPOINTS.PATIENTS.COMPLETE_ONBOARDING, data);
};

export const completeProfessionalOnboarding = (
  data: CompleteProfessionalOnboardingDto,
) => {
  return api.post<void>(API_ENDPOINTS.PROFESSIONALS.COMPLETE_ONBOARDING, data);
};

/**
 * Refreshes the auth token so newly added JWT claims
 * (e.g. PatientId, ProfessionalId) are available after onboarding.
 */
async function refreshAuthToken(): Promise<boolean> {
  try {
    const response = await fetch(`${env.apiUrl}${API_ENDPOINTS.AUTH.REFRESH}`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch {
    // Refresh failure is non-critical here; the 401 interceptor will retry later
    return false;
  }
}

export function useCompletePatientOnboarding() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, ProblemDetailsDto, CompletePatientOnboardingDto>({
    mutationFn: completePatientOnboarding,
    onSuccess: async () => {
      // Refresh token to pick up the new PatientId claim
      await refreshAuthToken();
      // Refetch both queries and wait for them to complete before navigation
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["currentUser"] }),
        queryClient.refetchQueries({ queryKey: ["currentPatient"] }),
      ]);
      // Navigate directly to appointments page to avoid redirect loops
      // Use replace to remove the callback page from history
      navigate({ to: ROUTE_PATHS.PATIENT.APPOINTMENTS, replace: true });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}

export function useCompleteProfessionalOnboarding() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    void,
    ProblemDetailsDto,
    CompleteProfessionalOnboardingDto
  >({
    mutationFn: completeProfessionalOnboarding,
    onSuccess: async () => {
      // Refresh token to pick up the new ProfessionalId claim
      await refreshAuthToken();
      // Refetch both queries and wait for them to complete before navigation
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["currentUser"] }),
        queryClient.refetchQueries({ queryKey: ["currentProfessional"] }),
      ]);
      // Navigate directly to appointments page to avoid redirect loops
      // Use replace to remove the callback page from history
      navigate({ to: ROUTE_PATHS.PROFESSIONAL.APPOINTMENTS, replace: true });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
