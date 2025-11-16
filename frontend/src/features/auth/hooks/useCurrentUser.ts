import { useQuery } from "@tanstack/react-query";
import { type User } from "@/features/auth";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/api-client";

const getCurrentUser = () => {
  return api.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER);
};

export function useCurrentUser() {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}
