import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { BanUserRequest } from "@/features/admin";
import { toast } from "sonner";

interface BanPatientParams {
  patientId: string;
  isBan: boolean;
}

const banPatient = ({ patientId, isBan }: BanPatientParams) => {
  const request: BanUserRequest = { isBan };
  return api.patch(API_ENDPOINTS.IDENTITY.BAN_USER(patientId), request);
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
