import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useStepsStore,
  type RegisterProfessionalDto,
} from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks";

export const registerProfessional = (credentials: RegisterProfessionalDto) => {
  return api.post<void>(
    API_ENDPOINTS.PROFESSIONALS.REGISTER_PROFESSIONAL,
    credentials,
  );
};

export function useRegisterProfessional() {
  const queryClient = useQueryClient();
  const { goToEmailVerification } = useAppNavigation();
  const { setStep } = useStepsStore();
  return useMutation<void, ProblemDetailsDto, RegisterProfessionalDto>({
    mutationFn: registerProfessional,
    onSuccess: (_data, credentials) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });
      goToEmailVerification(credentials.email);
      setStep(1);
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
