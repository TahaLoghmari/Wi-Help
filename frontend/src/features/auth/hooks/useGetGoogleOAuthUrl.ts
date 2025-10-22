import { useMutation } from "@tanstack/react-query";
import { type GoogleAuthResponseDto } from "@/features/auth";
import { handleApiError, api, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";

export const getGoogleOAuthUrl = () => {
  return api.get<GoogleAuthResponseDto>(API_ENDPOINTS.AUTH.GOOGLE_AUTHORIZE);
};

export function useGetGoogleOAuthUrl() {
  return useMutation<GoogleAuthResponseDto, ProblemDetailsDto, void>({
    mutationFn: getGoogleOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
