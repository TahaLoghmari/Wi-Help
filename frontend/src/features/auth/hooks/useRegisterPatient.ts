import { useMutation } from "@tanstack/react-query";
import {
  useStepsStore,
  type RegisterPatientDto,
  type RegisterProfessionalDto,
} from "@/features/auth";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { useAppNavigation } from "@/hooks";
import i18n from "i18next";

export type RegisterUserDto = RegisterPatientDto | RegisterProfessionalDto;

export const registerPatient = (credentials: RegisterUserDto) => {
  return api.post<void>(API_ENDPOINTS.PATIENTS.REGISTER_PATIENT, credentials);
};

export function useRegisterPatient() {
  const { goToEmailVerification } = useAppNavigation();
  const { setStep } = useStepsStore();
  return useMutation<void, ProblemDetailsDto, RegisterUserDto>({
    mutationFn: registerPatient,
    onSuccess: (_data, credentials) => {
      toast.success(i18n.t("toasts.auth.accountCreated"), {
        description: i18n.t("toasts.auth.accountCreatedDescription"),
      });
      goToEmailVerification(credentials.email);
      setStep(1);
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
