import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type {
  UpdateAppointmentStatusRequest,
  AppointmentStatus,
} from "@/features/admin";
import { toast } from "sonner";
import { handleApiError } from "@/hooks";
import i18n from "i18next";

interface UpdateAppointmentStatusParams {
  appointmentId: string;
  status: AppointmentStatus;
}

const updateAppointmentStatus = ({
  appointmentId,
  status,
}: UpdateAppointmentStatusParams) => {
  const request: UpdateAppointmentStatusRequest = { status };
  return api.patch(
    API_ENDPOINTS.APPOINTMENTS.UPDATE_STATUS_AS_ADMIN(appointmentId),
    request,
  );
};

export function UpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success(i18n.t("toasts.admin.appointmentStatusUpdated"));
    },
    onError: (error) => {
      handleApiError({ apiError: error as any });
    },
  });
}
