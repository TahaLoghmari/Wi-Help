import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface BanPatientParams {
  userId: string;
  isBan: boolean;
}

const banPatient = ({ userId, isBan }: BanPatientParams) => {
  return api.patch(API_ENDPOINTS.IDENTITY.BAN_USER(userId), {
    isBanned: isBan,
  });
};

export function BanPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banPatient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      toast.success(
        variables.isBan
          ? i18n.t("toasts.admin.patientBanned")
          : i18n.t("toasts.admin.patientUnbanned"),
      );
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
