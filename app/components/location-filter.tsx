"use client";

import { useState } from "react";
import { useSeller } from "@/lib/seller-context";

export function LocationFilter() {
  const { allSellers } = useSeller();
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Get unique cities
  const cities = Array.from(new Set(allSellers.map((s) => s.city).filter(Boolean)));
  const nearbySellers = selectedCity
    ? allSellers.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase() && s.isActive)
    : allSellers.filter((s) => s.isActive);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem" }}>📍 Find Local Sellers</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="city-filter" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
          Filter by City:
        </label>
        <select
          id="city-filter"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid var(--line)",
            borderRadius: "4px",
            fontSize: "1rem",
          }}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {nearbySellers.length === 0 ? (
          <p style={{ color: "#5e584d" }}>No sellers available in this location.</p>
        ) : (
          nearbySellers.map((seller) => (
            <div
              key={seller.id}
              style={{
                background: "white",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0" }}>{seller.shopName}</h3>
              <p style={{ margin: "0.25rem 0", color: "#5e584d", fontSize: "0.9rem" }}>
                📍 {seller.city}
              </p>
              <p style={{ margin: "0.25rem 0", color: "#5e584d", fontSize: "0.9rem" }}>
                👤 {seller.name}
              </p>
              <p style={{ margin: "0.5rem 0", fontSize: "0.85rem", color: "var(--accent)", fontWeight: "600" }}>
                ✓ Active Seller
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
