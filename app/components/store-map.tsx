"use client";

import { useEffect, useRef } from "react";

interface StoreMapProps {
  title?: string;
  height?: string;
}

// Sibagat Poblacion, Agusan del Sur coordinates
const STORE_LOCATION = {
  lat: 8.6324,
  lng: 126.3175,
  name: "Store Location - Sibagat Poblacion, Agusan del Sur",
};

declare global {
  interface Window {
    google?: any;
  }
}

export function StoreMap({ title = "📍 Store Location", height = "300px" }: StoreMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    // Check if Google Maps API is loaded
    if (!window.google) {
      console.warn("Google Maps API not loaded yet");
      return;
    }

    if (!mapRef.current || mapInstance.current) {
      return;
    }

    try {
      // Initialize map
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: {
          lat: STORE_LOCATION.lat,
          lng: STORE_LOCATION.lng,
        },
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });

      // Add marker for store location
      new window.google.maps.Marker({
        position: {
          lat: STORE_LOCATION.lat,
          lng: STORE_LOCATION.lng,
        },
        map: mapInstance.current,
        title: STORE_LOCATION.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 10px; font-size: 14px;"><strong>${STORE_LOCATION.name}</strong></div>`,
      });

      const marker = new window.google.maps.Marker({
        position: {
          lat: STORE_LOCATION.lat,
          lng: STORE_LOCATION.lng,
        },
        map: mapInstance.current,
        title: STORE_LOCATION.name,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstance.current, marker);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, []);

  return (
    <div
      style={{
        background: "white",
        border: "1px solid var(--line)",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "600" }}>
        {title}
      </h3>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: height,
          borderRadius: "4px",
          background: "#f0f0f0",
        }}
      />
      <div style={{ marginTop: "0.75rem", fontSize: "0.9rem", color: "#666" }}>
        <p style={{ margin: "0.25rem 0" }}>📍 Latitude: {STORE_LOCATION.lat}</p>
        <p style={{ margin: "0.25rem 0" }}>📍 Longitude: {STORE_LOCATION.lng}</p>
      </div>
    </div>
  );
}
