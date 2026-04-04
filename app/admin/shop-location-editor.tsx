"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("../components/map-component"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      Loading map...
    </div>
  ),
});

interface ShopLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  zoom: number;
}

export default function ShopLocationEditor() {
  const [shopLocation, setShopLocation] = useState<ShopLocation>({
    latitude: 8.6324,
    longitude: 126.3175,
    name: "Shoe Otah Boutique",
    address: "P-4 Poblacion, Sibagat, Agusan del Sur",
    zoom: 15,
  });

  const [editingLocation, setEditingLocation] = useState<ShopLocation>(shopLocation);
  const [isSaved, setIsSaved] = useState(true);
  const [showMap, setShowMap] = useState(true);

  // Load location from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("shop-location");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setShopLocation(parsed);
        setEditingLocation(parsed);
      } catch (e) {
        console.error("Failed to load shop location:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("shop-location", JSON.stringify(editingLocation));
    setShopLocation(editingLocation);
    setIsSaved(true);
  };

  const handleReset = () => {
    setEditingLocation(shopLocation);
    setIsSaved(true);
  };

  const handleInputChange = (field: keyof ShopLocation, value: string | number) => {
    setEditingLocation({
      ...editingLocation,
      [field]: field === "zoom" ? parseInt(value as string) : value,
    });
    setIsSaved(false);
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#2c2c2c" }}>📍 Shop Location Settings</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
          Configure your shop location that will be displayed on customer maps and tracking
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          backgroundColor: "#fafafa",
          padding: "2rem",
          borderRadius: "10px",
          border: "1px solid #e0d5cc",
        }}
      >
        {/* Left: Form Controls */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#2c2c2c",
                fontSize: "0.95rem",
              }}
            >
              Shop Name
            </label>
            <input
              type="text"
              value={editingLocation.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d0c7bf",
                borderRadius: "6px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              placeholder="Enter shop name"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#2c2c2c",
                fontSize: "0.95rem",
              }}
            >
              Shop Address
            </label>
            <input
              type="text"
              value={editingLocation.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d0c7bf",
                borderRadius: "6px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              placeholder="Enter shop address"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#2c2c2c",
                  fontSize: "0.95rem",
                }}
              >
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={editingLocation.latitude}
                onChange={(e) => handleInputChange("latitude", parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d0c7bf",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                placeholder="Latitude"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#2c2c2c",
                  fontSize: "0.95rem",
                }}
              >
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={editingLocation.longitude}
                onChange={(e) => handleInputChange("longitude", parseFloat(e.target.value))}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d0c7bf",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
                placeholder="Longitude"
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
                color: "#2c2c2c",
                fontSize: "0.95rem",
              }}
            >
              Map Zoom Level
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input
                type="range"
                min="1"
                max="20"
                value={editingLocation.zoom}
                onChange={(e) => handleInputChange("zoom", parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <span
                style={{
                  padding: "0.5rem 0.75rem",
                  backgroundColor: "#fff",
                  border: "1px solid #d0c7bf",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {editingLocation.zoom}
              </span>
            </div>
          </div>

          {/* Current Location Display */}
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#e3f2fd",
              borderLeft: "4px solid #2196f3",
              borderRadius: "6px",
              marginBottom: "1.5rem",
            }}
          >
            <strong style={{ display: "block", marginBottom: "0.5rem", color: "#1565c0" }}>
              📌 Current Location
            </strong>
            <div style={{ fontSize: "0.85rem", color: "#1565c0", lineHeight: 1.6 }}>
              <div>Latitude: {shopLocation.latitude.toFixed(6)}</div>
              <div>Longitude: {shopLocation.longitude.toFixed(6)}</div>
              <div>Zoom: {shopLocation.zoom}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleSave}
              disabled={isSaved}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                backgroundColor: isSaved ? "#ccc" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isSaved ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.backgroundColor = "#45a049";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.backgroundColor = "#4caf50";
                }
              }}
            >
              ✓ Save Location
            </button>
            <button
              onClick={handleReset}
              disabled={isSaved}
              style={{
                flex: 1,
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                color: isSaved ? "#ccc" : "#d32f2f",
                border: `1px solid ${isSaved ? "#ccc" : "#d32f2f"}`,
                borderRadius: "6px",
                cursor: isSaved ? "not-allowed" : "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.backgroundColor = "#ffebee";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              ↺ Reset
            </button>
          </div>

          {!isSaved && (
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#fff3e0",
                border: "1px solid #ff9800",
                borderRadius: "6px",
                color: "#e65100",
                fontSize: "0.9rem",
              }}
            >
              ⚠️ You have unsaved changes
            </div>
          )}
        </div>

        {/* Right: Map Preview */}
        <div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#2c2c2c", fontSize: "1rem" }}>
            🗺️ Map Preview
          </h3>
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #d0c7bf",
              height: "350px",
            }}
          >
            <MapComponent
              position={[editingLocation.latitude, editingLocation.longitude]}
              title={editingLocation.name}
              height="350px"
              zoom={editingLocation.zoom}
              showLiveTracking={false}
            />
          </div>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.85rem",
              color: "#666",
              lineHeight: 1.4,
            }}
          >
            📍 <strong>{editingLocation.name}</strong>
            <br />
            📮 {editingLocation.address}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1.5rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #2196f3",
        }}
      >
        <h4 style={{ margin: "0 0 1rem 0", color: "#1565c0", fontSize: "0.95rem" }}>
          📍 How to Get EXACT Coordinates for {shopLocation.address}:
        </h4>
        <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#1565c0", fontSize: "0.9rem", lineHeight: 2 }}>
          <li><strong>Open Google Maps</strong> in a new browser tab</li>
          <li><strong>Search for:</strong> "Shoe Otah Boutique, Sibagat, Agusan del Sur" or "Purok 4, Poblacion, Sibagat"</li>
          <li><strong>Right-click</strong> directly on the red marker pin (not the info box)</li>
          <li><strong>Select "Copy coordinates"</strong> from the menu</li>
          <li><strong>The format will be:</strong> like "8.6327, 126.3158" (latitude, longitude)</li>
          <li><strong>Paste the coordinates:</strong> 
            <ul style={{ margin: "0.5rem 0 0", paddingLeft: "1rem" }}>
              <li>First number (latitude) → goes in <strong>Latitude</strong> field</li>
              <li>Second number (longitude) → goes in <strong>Longitude</strong> field</li>
            </ul>
          </li>
          <li><strong>Set zoom to 17-18</strong> for street-level precision</li>
          <li><strong>Click "Save Location"</strong> to apply changes</li>
        </ol>
        <p style={{ margin: "1rem 0 0", color: "#1565c0", fontSize: "0.85rem" }}>
          💡 <strong>Tip:</strong> The exact coordinates will ensure customers can track your precise shop location with 95%+ accuracy. 
          Current coordinates are approximate but should be refined from Google Maps for best results.
        </p>
      </div>
    </div>
  );
}

