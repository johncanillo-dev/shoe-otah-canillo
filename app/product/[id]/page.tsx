"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useSeller } from "@/lib/seller-context";
import Link from "next/link";
import ChatButton from "@/app/components/chat-button";
import { ProductVideo } from "@/app/components/product-video";

interface AdminProduct {
  id: string;
  name: string;
  category: "Shoes" | "Shirts" | "Slippers" | "Sacks";
  price: number;
  description: string;
  image?: string;
  videoUrl?: string;
  isEcoFriendly?: boolean;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { sellerProducts, seller } = useSeller();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [reviews, setReviews] = useState<Array<{ name: string; rating: number; comment: string }>>([]);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const productId = params.id as string;

  useEffect(() => {
    // Load product from localStorage
    const saved = localStorage.getItem("shoe-otah-products");
    if (saved) {
      try {
        const products = JSON.parse(saved);
        const found = products.find((p: AdminProduct) => p.id === productId);
        if (found) {
          setProduct(found);
          // Load reviews for this product
          const productReviews = localStorage.getItem(`product-reviews-${productId}`);
          if (productReviews) {
            setReviews(JSON.parse(productReviews));
          }
        }
      } catch (e) {
        console.error("Failed to load product:", e);
      }
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: quantity,
        image: product.image,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: quantity,
        image: product.image,
      });
      router.push("/checkout");
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name.trim() && newReview.comment.trim()) {
      const updatedReviews = [...reviews, newReview];
      setReviews(updatedReviews);
      localStorage.setItem(`product-reviews-${productId}`, JSON.stringify(updatedReviews));
      setNewReview({ name: "", rating: 5, comment: "" });
      setShowReviewForm(false);
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0";

  if (!product) {
    return (
      <section className="container" style={{ padding: "2rem 0", textAlign: "center" }}>
        <p>Loading product...</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: "2rem 0" }}>
      <Link href="/" style={{ color: "var(--accent)", textDecoration: "none", marginBottom: "1rem", display: "inline-block" }}>
        ← Back to Shop
      </Link>

      <div className="product-detail">
        <div className="product-image-section">
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "12px",
              padding: "2rem",
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            {product.image || `📦 ${product.name}`}
          </div>
          
          {product.videoUrl && <ProductVideo videoUrl={product.videoUrl} productName={product.name} />}
        </div>

        <div className="product-info-section">
          <div>
            <span
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "white",
                padding: "0.3rem 0.6rem",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              {product.category}
            </span>

            <h1 style={{ margin: "0.5rem 0", fontSize: "2rem" }}>{product.name}</h1>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0.5rem 0", color: "#666", fontSize: "0.95rem" }}>{product.description}</p>
            </div>

            <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--line)" }}>
              <p style={{ margin: "0", fontSize: "2rem", fontWeight: "700", color: "var(--accent)" }}>₱{product.price.toFixed(2)}</p>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "#999" }}>Free shipping nationwide</p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Quantity</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: "0.5rem 0.75rem",
                    border: "1px solid var(--line)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: "#f9f9f9",
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: "40px", textAlign: "center", fontWeight: "600" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    border: "1px solid var(--line)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    background: "#f9f9f9",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <button onClick={handleAddToCart} className="btn btn-primary" style={{ cursor: "pointer" }}>
                {isAdded ? "✓ Added" : "🛒 Add to Cart"}
              </button>
              <button onClick={handleBuyNow} className="btn btn-primary" style={{ cursor: "pointer", background: "white", color: "var(--accent)", border: "2px solid var(--accent)" }}>
                💳 Buy Now
              </button>
            </div>

            {seller && (
              <div style={{ marginBottom: "1.5rem" }}>
                <ChatButton recipientId={seller.id} recipientName={`${seller.name} (Seller)`} variant="secondary" />
              </div>
            )}

            {product.isEcoFriendly && (
              <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#e8f5e9", borderRadius: "8px", border: "1px solid #4caf50" }}>
                <p style={{ margin: "0", fontSize: "1rem", color: "#2e7d32", fontWeight: "600" }}>🌱 Eco-Friendly Product</p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#558b2f" }}>This product is made with sustainable materials</p>
              </div>
            )}

            <div
              style={{
                padding: "1rem",
                background: "#f9f9f9",
                borderRadius: "8px",
                fontSize: "0.9rem",
                lineHeight: "1.6",
              }}
            >
              <p style={{ margin: "0.5rem 0" }}>
                <strong>🚚 Delivery:</strong> 2-3 days nationwide
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>↩️ Returns:</strong> 30 days money-back guarantee
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>💯 Authentic:</strong> 100% genuine products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "2px solid var(--line)" }}>
        <h2 style={{ marginBottom: "1rem" }}>Reviews & Ratings</h2>

        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "2rem", fontWeight: "700" }}>{averageRating}</span>
            <div>
              <div style={{ fontSize: "1.1rem", color: "var(--accent)" }}>★★★★★</div>
              <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Customer Reviews</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1rem",
                    border: "1px solid var(--line)",
                    borderRadius: "8px",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                    <strong>{review.name}</strong>
                    <span style={{ color: "var(--accent)" }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  </div>
                  <p style={{ margin: "0.5rem 0 0", color: "#333", lineHeight: "1.5" }}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            style={{
              padding: "0.75rem 1.5rem",
              border: "2px solid var(--accent)",
              background: "white",
              color: "var(--accent)",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            + Write a Review
          </button>
        ) : (
          <form
            onSubmit={handleAddReview}
            style={{
              padding: "1.5rem",
              border: "2px solid var(--accent)",
              borderRadius: "8px",
              background: "#fffaf2",
            }}
          >
            <h3 style={{ marginTop: "0" }}>Write Your Review</h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Your Name</label>
              <input
                type="text"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                placeholder="Enter your name"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              >
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Good</option>
                <option value="3">★★★☆☆ Average</option>
                <option value="2">★★☆☆☆ Poor</option>
                <option value="1">★☆☆☆☆ Terrible</option>
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ cursor: "pointer" }}
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid var(--line)",
                  background: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
