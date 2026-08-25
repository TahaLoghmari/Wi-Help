import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { sessionKeys } from "./query-keys";
import type { CurrentUserDto, SessionRole, UserDto } from "./types";

export function normalizeSessionRole(role: string): SessionRole {
  switch (role.toLowerCase()) {
    case "patient":
      return "Patient";
    case "professional":
      return "Professional";
    case "admin":
      return "Admin";
    default:
      return "Unknown";
  }
}

const getCurrentUser = async (): Promise<CurrentUserDto> => {
  const user = await api.get<UserDto>(API_ENDPOINTS.AUTH.CURRENT_USER);

  return { ...user, role: normalizeSessionRole(user.role) };
};

export function useCurrentUser() {
  return useQuery<CurrentUserDto>({
    queryKey: sessionKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  });
}
