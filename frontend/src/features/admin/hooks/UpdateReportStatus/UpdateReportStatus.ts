import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config";
import type { UpdateReportStatusRequest } from "@/features/admin";

interface UpdateReportStatusParams {
  reportId: string;
  data: UpdateReportStatusRequest;
}

const updateReportStatus = ({ reportId, data }: UpdateReportStatusParams) => {
  return api.put(API_ENDPOINTS.REPORTS.UPDATE_STATUS(reportId), data);
};

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
    },
  });
}
