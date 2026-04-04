"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Loading...</p>
        </div>
      </section>
    );
  }

  if (!isLoggedIn) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Not Logged In</p>
          <h1>Please Log In</h1>
          <p style={{ marginTop: "1rem", color: "#5e584d" }}>
            You need to log in to view your cart.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Go to Login
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Shopping Cart</p>
          <h1>Your Cart is Empty</h1>
          <p style={{ marginTop: "1rem", color: "#5e584d" }}>
            Start shopping to add items to your cart.
          </p>
          <Link href="/" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-block" }}>
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Redirect to checkout page
    setTimeout(() => {
      router.push("/checkout");
    }, 500);
  };

  return (
    <section className="cart-shell container">
      <div className="cart-head">
        <h1>Shopping Cart</h1>
        <p className="form-status">({items.length} items)</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="form-status">{item.category}</p>
              </div>
              <div className="cart-item-qty">
                <label htmlFor={`qty-${item.id}`}>Qty:</label>
                <input
                  id={`qty-${item.id}`}
                  type="number"
                  min="1"
                  max="99"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                />
              </div>
              <div className="cart-item-price">
                <strong>₱{(item.price * item.quantity).toFixed(2)}</strong>
                <button type="button" onClick={() => removeItem(item.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h2>Order Summary</h2>
            <div className="summary-line">
              <span>Subtotal:</span>
              <strong>₱{total.toFixed(2)}</strong>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <strong>Free</strong>
            </div>
            <div className="summary-line">
              <span>Tax:</span>
              <strong>₱{(total * 0.08).toFixed(2)}</strong>
            </div>
            <div className="summary-line summary-total">
              <span>Total:</span>
              <strong>₱{(total * 1.08).toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
            <Link href="/" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", marginTop: "0.5rem" }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
