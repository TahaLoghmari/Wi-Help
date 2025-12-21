import { useCallback, useEffect, useRef } from "react";
import { useUpdateLocation } from "./useUpdateLocation";
import type { UserDto } from "@/features/auth/types";

const LOCATION_FRESHNESS_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Hook that manages user location updates.
 * - Only requests location when data is stale (>30 min) or missing
 * - Uses browser Geolocation API (getCurrentPosition, not watchPosition)
 * - Gracefully handles permission denial
 * - Should be called only when user is authenticated
 */
export function useLocationManager(
  isAuthenticated: boolean,
  currentUser?: UserDto,
) {
  const { mutate: updateLocation } = useUpdateLocation();
  const hasRequestedRef = useRef(false);

  const isLocationFresh = useCallback((): boolean => {
    if (!currentUser?.location?.timestamp) return false;
    const lastUpdate = new Date(currentUser.location.timestamp).getTime();
    return Date.now() - lastUpdate < LOCATION_FRESHNESS_MS;
  }, [currentUser]);

  const requestLocation = useCallback(
    (onSuccess?: () => void) => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString(),
          };

          updateLocation(coordinates, {
            onSuccess: () => {
              console.log("Location updated successfully");
              onSuccess?.();
            },
            onError: (error) => {
              console.error("Failed to update location:", error);
            },
          });
        },
        (error) => {
          // Graceful degradation - app continues to function
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.info(
                "User denied location permission - app continues without location",
              );
              break;
            case error.POSITION_UNAVAILABLE:
              console.warn("Location information unavailable");
              break;
            case error.TIMEOUT:
              console.warn("Location request timed out");
              break;
            default:
              console.warn("Unknown location error:", error.message);
          }
        },
        {
          enableHighAccuracy: false, // Balance accuracy vs battery
          timeout: 10000, // 10 second timeout
          maximumAge: LOCATION_FRESHNESS_MS, // Accept cached position within freshness window
        },
      );
    },
    [updateLocation],
  );

  useEffect(() => {
    // Only request if:
    // 1. User is authenticated
    // 2. We haven't already requested in this session
    // 3. Location is not fresh
    if (
      isAuthenticated &&
      currentUser &&
      !hasRequestedRef.current &&
      !isLocationFresh()
    ) {
      hasRequestedRef.current = true;
      requestLocation();
    }
  }, [isAuthenticated, currentUser, isLocationFresh, requestLocation]);

  // Reset the request flag when user changes
  useEffect(() => {
    hasRequestedRef.current = false;
  }, [currentUser?.id]);

  return { requestLocation };
}
