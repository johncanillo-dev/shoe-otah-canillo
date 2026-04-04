import { useState, useEffect } from "react";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  position: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "Failed to get location";
        if (err.code === err.PERMISSION_DENIED) {
          errorMessage = "Location permission denied";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = "Location unavailable";
        } else if (err.code === err.TIMEOUT) {
          errorMessage = "Location request timed out";
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, isLoading, error };
}
