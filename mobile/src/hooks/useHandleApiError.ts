import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { type ProblemDetailsDto } from "@/types/enums.types";

export function useHandleApiError() {
  const { t } = useTranslation();

  return function handleApiError(error: ProblemDetailsDto | Error | unknown) {
    if (error instanceof TypeError) {
      Toast.show({ type: "error", text1: t("errors.connectionError") });
    } else if (error && typeof error === "object" && "title" in error) {
      const problem = error as ProblemDetailsDto;
      const msg = t(`errors.backend.${problem.title}`, {
        defaultValue: t("errors.unexpected"),
      });
      Toast.show({ type: "error", text1: msg, text2: problem.detail });
    } else {
      Toast.show({ type: "error", text1: t("errors.unexpected") });
    }
  };
}
