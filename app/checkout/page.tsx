"use client";

import { Suspense } from "react";
import CheckoutContent from "./checkout-content";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Loading checkout...</p>
        </div>
      </section>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
