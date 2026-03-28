import { useQuery } from "@tanstack/react-query";
import { type UserDto } from "@/types/enums.types";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";

export const currentUserKeys = {
  currentUser: ["currentUser"] as const,
};

const getCurrentUser = () => {
  return api.get<UserDto>(API_ENDPOINTS.AUTH.CURRENT_USER);
};

export function useCurrentUser() {
  return useQuery<UserDto>({
    queryKey: currentUserKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  });
}
