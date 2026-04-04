"use client";

import { useState } from "react";
import { useSeller } from "@/lib/seller-context";

export function ProductApprovalManager() {
  const { getPendingProducts, approveProduct, rejectProduct, getSellerById } = useSeller();
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const pendingProducts = getPendingProducts();

  const handleApprove = (productId: string) => {
    approveProduct(productId);
    alert("Product approved!");
  };

  const handleReject = (productId: string) => {
    if (confirm("Are you sure you want to reject this product?")) {
      rejectProduct(productId);
      alert("Product rejected!");
    }
  };

  return (
    <section className="admin-section">
      <div className="section-header">
        <h2>Product Approval ({pendingProducts.length})</h2>
        <span style={{ fontSize: "0.9rem", color: "#ff6b6b", fontWeight: "600" }}>
          {pendingProducts.length} Pending
        </span>
      </div>

      {pendingProducts.length === 0 ? (
        <p className="empty-state">No products pending approval.</p>
      ) : (
        <div className="products-approval-list">
          {pendingProducts.map((product) => {
            const seller = getSellerById(product.sellerId);
            const isExpanded = expandedProduct === product.id;

            return (
              <div key={product.id} className="approval-card">
                <div
                  className="approval-header"
                  onClick={() => setExpandedProduct(isExpanded ? null : product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-info-section">
                    <h3>{product.name}</h3>
                    <p className="product-meta">
                      <span>{product.category}</span>
                      <span>₱{product.price.toFixed(2)}</span>
                      <span>by {seller?.shopName || "Unknown"}</span>
                    </p>
                  </div>
                  <span className="expand-icon">{isExpanded ? "▼" : "▶"}</span>
                </div>

                {isExpanded && (
                  <div className="approval-details">
                    <div className="product-details">
                      <p>
                        <strong>Seller:</strong> {seller?.name} ({seller?.email})
                      </p>
                      <p>
                        <strong>Description:</strong> {product.description}
                      </p>
                      <p>
                        <strong>Category:</strong> {product.category}
                      </p>
                      <p>
                        <strong>Price:</strong> ₱{product.price.toFixed(2)}
                      </p>
                      <p>
                        <strong>Submitted:</strong> {new Date(product.createdAt).toLocaleString()}
                      </p>
                      {product.image && (
                        <p>
                          <strong>Image:</strong> <a href={product.image} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>View</a>
                        </p>
                      )}
                    </div>

                    <div className="approval-actions">
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="btn btn-primary"
                        style={{ background: "#4caf50" }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="btn btn-delete"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .products-approval-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-top: 1rem;
        }

        .approval-card {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
          overflow: hidden;
        }

        .approval-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem;
          gap: 1rem;
        }

        .approval-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .product-info-section {
          flex: 1;
        }

        .product-meta {
          display: flex;
          gap: 1rem;
          margin: 0;
          font-size: 0.9rem;
          color: #5e584d;
        }

        .product-meta span {
          padding: 0.25rem 0.75rem;
          background: #faf8f3;
          border-radius: 4px;
        }

        .expand-icon {
          color: #5e584d;
          font-weight: bold;
        }

        .approval-details {
          border-top: 1px solid var(--line);
          padding: 1.5rem;
          background: #faf8f3;
        }

        .product-details {
          margin-bottom: 1rem;
        }

        .product-details p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
        }

        .approval-actions {
          display: flex;
          gap: 0.5rem;
        }

        .approval-actions button {
          flex: 1;
        }
      `}</style>
    </section>
  );
}
