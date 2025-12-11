import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

interface BanProfessionalParams {
  userId: string;
  isBan: boolean;
}

const banProfessional = ({ userId, isBan }: BanProfessionalParams) => {
  const queryParams = new URLSearchParams({ IsBanned: isBan.toString() });
  return api.patch(
    `${API_ENDPOINTS.IDENTITY.BAN_USER(userId)}?${queryParams.toString()}`,
  );
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
