import { useQuery } from "@tanstack/react-query";
import { type UserDto } from "@/features/auth";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getCurrentUser = () => {
  return api.get<UserDto>(API_ENDPOINTS.AUTH.CURRENT_USER);
};

export function useCurrentUser() {
  return useQuery<UserDto>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}
