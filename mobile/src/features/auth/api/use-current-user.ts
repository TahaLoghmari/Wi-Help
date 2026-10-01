import { useQuery } from "@tanstack/react-query";
import { AUTH_ENDPOINTS } from "@/features/auth/api/endpoints";
import { api } from "@/shared/api/api-client";
import { sessionKeys } from "./query-keys";
import type { CurrentUserDto, SessionRole, UserDto } from "@/features/auth/model/session.types";

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

const getCurrentUser = async (): Promise<CurrentUserDto | null> => {
  let user: UserDto;
  try {
    user = await api.get<UserDto>(AUTH_ENDPOINTS.CURRENT_USER);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 401
    ) {
      return null;
    }
    throw error;
  }

  return { ...user, role: normalizeSessionRole(user.role) };
};

export function useCurrentUser() {
  return useQuery<CurrentUserDto | null>({
    queryKey: sessionKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  });
}
