import { useCallback, useEffect, useRef } from "react";
import { useUpdateLocation } from "./useUpdateLocation";

const LOCATION_STORAGE_KEY = "lastLocationUpdate";
const LOCATION_FRESHNESS_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Hook that manages user location updates.
 * - Only requests location when data is stale (>30 min) or missing
 * - Uses browser Geolocation API (getCurrentPosition, not watchPosition)
 * - Gracefully handles permission denial
 * - Should be called only when user is authenticated
 */
export function useLocationManager(isAuthenticated: boolean, userId?: string) {
  const { mutate: updateLocation } = useUpdateLocation();
  const hasRequestedRef = useRef(false);

  const getLastUpdateTime = useCallback((): number | null => {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      // Only return if it's for the same user
      if (data.userId === userId) {
        return data.timestamp;
      }
      return null;
    } catch {
      return null;
    }
  }, [userId]);

  const setLastUpdateTime = useCallback((timestamp: number) => {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify({
      userId,
      timestamp,
    }));
  }, [userId]);

  const isLocationFresh = useCallback((): boolean => {
    const lastUpdate = getLastUpdateTime();
    if (!lastUpdate) return false;
    return Date.now() - lastUpdate < LOCATION_FRESHNESS_MS;
  }, [getLastUpdateTime]);

  const requestLocation = useCallback(() => {
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
            setLastUpdateTime(Date.now());
            console.log("Location updated successfully");
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
            console.info("User denied location permission - app continues without location");
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
      }
    );
  }, [updateLocation, setLastUpdateTime]);

  useEffect(() => {
    // Only request if:
    // 1. User is authenticated
    // 2. We haven't already requested in this session
    // 3. Location is not fresh (or missing)
    if (!isAuthenticated || !userId) {
      return;
    }

    if (hasRequestedRef.current) {
      return;
    }

    if (isLocationFresh()) {
      console.log("Location is fresh, skipping request");
      return;
    }

    hasRequestedRef.current = true;
    requestLocation();
  }, [isAuthenticated, userId, isLocationFresh, requestLocation]);

  // Reset the request flag when user changes
  useEffect(() => {
    hasRequestedRef.current = false;
  }, [userId]);
}
