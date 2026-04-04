"use client";

import { useSeller } from "@/lib/seller-context";

export function EcoFriendlyFilter({ onFilterChange }: { onFilterChange?: (ecoOnly: boolean) => void }) {
  const { allSellerProducts } = useSeller();

  const ecoProducts = allSellerProducts.filter((p) => p.isEcoFriendly && p.status === "approved");
  const totalApprovedProducts = allSellerProducts.filter((p) => p.status === "approved").length;

  const handleToggle = (ecoOnly: boolean) => {
    onFilterChange?.(ecoOnly);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
        border: "2px solid #4caf50",
        borderRadius: "8px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "2rem" }}>🌱</span>
        <div>
          <h2 style={{ margin: "0", fontSize: "1.2rem", color: "#2e7d32" }}>Eco-Friendly Products</h2>
          <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#558b2f" }}>
            Support sustainable shopping • {ecoProducts.length} products available
          </p>
        </div>
      </div>

      <p style={{ margin: "0.75rem 0 0 0", fontSize: "0.9rem", color: "#558b2f", maxWidth: "70%" }}>
        These products are from sellers committed to eco-friendly practices. By choosing these items, you're supporting
        sustainable businesses and protecting our environment.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={() => handleToggle(true)}
          style={{
            background: "#4caf50",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
          }}
        >
          Show Only Eco-Friendly
        </button>
        <button
          onClick={() => handleToggle(false)}
          style={{
            background: "transparent",
            color: "#4caf50",
            border: "2px solid #4caf50",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.9rem",
            marginLeft: "0.5rem",
          }}
        >
          Show All Products
        </button>
      </div>
    </div>
  );
}
