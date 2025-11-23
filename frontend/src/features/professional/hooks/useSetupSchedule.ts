import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { type UpdateProfessionalDto } from "@/features/professional";
import { toFormData } from "@/lib/utils";

export const setupSchedule = (credentials: UpdateProfessionalDto) => {
    const formData = toFormData(credentials);

    return api.put<void>(
        API_ENDPOINTS.PROFESSIONALS.SETUP_SCHEDULE,
        formData,
    );
};

export function useSetupSchedule() {
    const queryClient = useQueryClient();
    return useMutation<void, ProblemDetailsDto, UpdateProfessionalDto>({
        mutationFn: setupSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["currentProfessional"] });
            toast.success("Schedule setup successfully!");
        },
        onError: (error) => handleApiError({ apiError: error }),
    });
}
