import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import { toast } from "sonner";

interface BanPatientParams {
  userId: string;
  isBan: boolean;
}

const banPatient = ({ userId, isBan }: BanPatientParams) => {
  const queryParams = new URLSearchParams({ IsBanned: isBan.toString() });
  return api.patch(
    `${API_ENDPOINTS.IDENTITY.BAN_USER(userId)}?${queryParams.toString()}`,
  );
};

export function BanPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: banPatient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      toast.success(
        variables.isBan
          ? "Patient banned successfully"
          : "Patient unbanned successfully",
      );
    },
    onError: () => {
      toast.error("Failed to update patient ban status");
    },
  });
}
