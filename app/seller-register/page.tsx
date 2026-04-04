"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useSeller } from "@/lib/seller-context";

export default function SellerRegisterPage() {
  const router = useRouter();
  const { sellerLogin } = useSeller();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", shopName: "", city: "" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.password || !formData.shopName || !formData.city) {
      setStatus("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setStatus("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    if (sellerLogin(formData.email, formData.password, formData.name, formData.shopName, formData.city)) {
      setStatus("Account created successfully! Redirecting to seller dashboard...");
      setTimeout(() => {
        router.push("/seller");
      }, 1000);
    } else {
      setStatus("Registration failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="kicker">Start Selling</p>
        <h1>Seller Registration</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <label htmlFor="shopname">Shop Name</label>
          <input
            id="shopname"
            type="text"
            placeholder="My Awesome Shop"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            required
          />

          <label htmlFor="city">City/Location</label>
          <input
            id="city"
            type="text"
            placeholder="Manila, Cebu, Davao"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="seller@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Seller Account"}
          </button>

          {status && <p className="form-status">{status}</p>}

          <p className="auth-footnote">
            Already a seller? <Link href="/login">Login here.</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
