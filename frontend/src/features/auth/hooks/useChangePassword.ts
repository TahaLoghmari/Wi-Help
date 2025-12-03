import { useMutation } from "@tanstack/react-query";
import { type ChangePasswordDto } from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/endpoints";

export const changePassword = (credentials: ChangePasswordDto) => {
  return api.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, credentials);
};

export function useChangePassword() {
  return useMutation<void, ProblemDetailsDto, ChangePasswordDto>({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        description: "Your password has been updated.",
      });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
