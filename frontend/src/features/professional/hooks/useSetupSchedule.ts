import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, handleApiError, type ProblemDetailsDto } from "@/index";
import { API_ENDPOINTS } from "@/config/endpoints";
import { toast } from "sonner";
import { type SetupScheduleDto } from "@/features/professional";

export const setupSchedule = (data: SetupScheduleDto) => {
    return api.post<void>(
        API_ENDPOINTS.PROFESSIONALS.SETUP_SCHEDULE,
        data,
    );
};

export function useSetupSchedule() {
    const queryClient = useQueryClient();
    return useMutation<void, ProblemDetailsDto, SetupScheduleDto>({
        mutationFn: setupSchedule,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedule"] });
            toast.success("Schedule setup successfully!");
        },
        onError: (error) => handleApiError({ apiError: error }),
    });
}
