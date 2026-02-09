import { useMutation } from "@tanstack/react-query";
import { type GoogleAuthResponseDto } from "@/features/auth";
import { handleApiError, api, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";

export const getGoogleOAuthUrl = (role?: string) => {
  const url = role
    ? `${API_ENDPOINTS.AUTH.GOOGLE_AUTHORIZE}?role=${role}`
    : API_ENDPOINTS.AUTH.GOOGLE_AUTHORIZE;
  return api.get<GoogleAuthResponseDto>(url);
};

export function useGetGoogleOAuthUrl() {
  return useMutation<
    GoogleAuthResponseDto,
    ProblemDetailsDto,
    string | undefined
  >({
    mutationFn: (role?: string) => getGoogleOAuthUrl(role),
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
