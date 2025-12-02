import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config";
import { api } from "@/api-client";
import type { GetExperiencesDto } from "./GetExperiencesDto";

const getExperiences = () => {
  return api.get<GetExperiencesDto[]>(
    API_ENDPOINTS.PROFESSIONALS.GET_EXPERIENCES,
  );
};

export function useGetExperiences() {
  return useQuery<GetExperiencesDto[]>({
    queryKey: ["experiences"],
    queryFn: getExperiences,
  });
}
