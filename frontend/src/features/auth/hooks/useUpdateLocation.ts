import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api-client";
import { API_ENDPOINTS } from "@/config/endpoints";
import type { LocationCoordinates } from "@/features/auth/types";

/**
 * Mutation hook for sending location coordinates to the backend.
 */
const updateLocation = (coordinates: LocationCoordinates) => {
  return api.patch(API_ENDPOINTS.IDENTITY.UPDATE_LOCATION, coordinates);
};

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
