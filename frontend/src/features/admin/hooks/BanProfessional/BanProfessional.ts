import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { BanUserRequest } from "@/features/admin";
import { toast } from "sonner";

interface BanProfessionalParams {
  professionalId: string;
  isBan: boolean;
}

const banProfessional = ({ professionalId, isBan }: BanProfessionalParams) => {
  const request: BanUserRequest = { isBan };
  return api.patch(API_ENDPOINTS.IDENTITY.BAN_USER(professionalId), request);
};

export function BanProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banProfessional,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-professionals"] });
      toast.success(
        variables.isBan
          ? "Professional banned successfully"
          : "Professional unbanned successfully",
      );
    },
    onError: () => {
      toast.error("Failed to update professional ban status");
    },
  });
}
