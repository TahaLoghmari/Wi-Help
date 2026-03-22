import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { type RegisterPatientDto } from "@/features/auth/types/api.types";
import { type ProblemDetailsDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";
import { useHandleApiError } from "@/hooks/useHandleApiError";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useStepsStore } from "@/features/auth/stores/useStepsStore";
import { useTranslation } from "react-i18next";

export function useRegisterPatient() {
  const handleApiError = useHandleApiError();
  const { goToLogin } = useAppNavigation();
  const { setStep } = useStepsStore();
  const { t } = useTranslation();

  return useMutation<void, ProblemDetailsDto, RegisterPatientDto>({
    mutationFn: (credentials) =>
      api.post<void>(API_ENDPOINTS.PATIENTS.REGISTER_PATIENT, credentials),
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
