import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type {
  UpdateAppointmentStatusRequest,
  AppointmentStatus,
} from "@/features/admin";
import { toast } from "sonner";

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
      toast.success("Appointment status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update appointment status");
    },
  });
}
