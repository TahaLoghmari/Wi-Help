import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { type RegisterProfessionalDto } from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import { useAppNavigation } from "@/hooks/use-app-navigation";
import { useStepsStore } from "@/features/auth/stores/use-steps-store";
import { useTranslation } from "react-i18next";

export function useRegisterProfessional() {
  const handleApiError = useHandleApiError();
  const { goToLogin } = useAppNavigation();
  const { setStep } = useStepsStore();
  const { t } = useTranslation();

  return useMutation<void, ProblemDetailsDto, RegisterProfessionalDto>({
    mutationFn: (credentials) =>
      api.post<void>(
        API_ENDPOINTS.PROFESSIONALS.REGISTER_PROFESSIONAL,
        credentials,
      ),
    onSuccess: () => {
      setStep(1);
      Toast.show({
        type: "success",
        text1: t("auth.accountCreated"),
        text2: t("auth.checkEmailToConfirm"),
      });
      goToLogin();
    },
    onError: (error) => handleApiError(error),
  });
}
