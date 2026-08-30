import { useCallback } from "react";
import Toast from "react-native-toast-message";
import {
  useCancelAppointmentByProfessional,
  useCompleteAppointment,
  useRespondToAppointment,
} from "@/entities/appointment";
import { useHandleApiError } from "@/hooks/use-handle-api-error";
import type { CompleteAppointmentFormValues } from "@/features/appointments/types/completion-form.types";

export function useAppointmentActions() {
  const respondMutation = useRespondToAppointment();
  const cancelMutation = useCancelAppointmentByProfessional();
  const completeMutation = useCompleteAppointment();
  const handleApiError = useHandleApiError();

  const respond = useCallback(
    (appointmentId: string, isAccepted: boolean, onSuccess?: () => void) => {
      respondMutation.mutate(
        { appointmentId, isAccepted },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: isAccepted
                ? "Appointment accepted"
                : "Appointment declined",
            });
            onSuccess?.();
          },
          onError: handleApiError,
        },
      );
    },
    [handleApiError, respondMutation],
  );

  const cancel = useCallback(
    (appointmentId: string, onSuccess?: () => void) => {
      cancelMutation.mutate(appointmentId, {
        onSuccess: () => {
          Toast.show({ type: "success", text1: "Appointment cancelled" });
          onSuccess?.();
        },
        onError: handleApiError,
      });
    },
    [cancelMutation, handleApiError],
  );

  const complete = useCallback(
    (
      appointmentId: string,
      values: CompleteAppointmentFormValues,
      onSuccess?: () => void,
    ) => {
      completeMutation.mutate(
        { appointmentId, ...values },
        {
          onSuccess: () => {
            Toast.show({ type: "success", text1: "Appointment completed" });
            onSuccess?.();
          },
          onError: handleApiError,
        },
      );
    },
    [completeMutation, handleApiError],
  );

  return {
    respond,
    cancel,
    complete,
    isResponding: respondMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
}
