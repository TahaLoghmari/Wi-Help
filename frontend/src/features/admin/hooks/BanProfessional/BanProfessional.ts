import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface BanProfessionalParams {
  userId: string;
  isBan: boolean;
}

const banProfessional = ({ userId, isBan }: BanProfessionalParams) => {
  return api.patch(API_ENDPOINTS.IDENTITY.BAN_USER(userId), {
    isBanned: isBan,
  });
};

export function BanProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banProfessional,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      toast.success(
        variables.isBan
          ? i18n.t("toasts.admin.professionalBanned")
          : i18n.t("toasts.admin.professionalUnbanned"),
      );
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
