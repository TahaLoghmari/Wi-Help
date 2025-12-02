import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetEducationsDto } from "./GetEducationsDto";

const getEducations = () => {
  return api.get<GetEducationsDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_EDUCATIONS,
  );
};

export function useGetEducations() {
  return useQuery<GetEducationsDto[]>({
    queryKey: ["educations"],
    queryFn: getEducations,
  });
}
