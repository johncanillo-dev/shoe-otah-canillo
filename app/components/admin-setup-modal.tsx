"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

export default function AdminSetupModal() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminPasswordSet, setAdminPasswordSet] = useState(false);

  useEffect(() => {
    // Check if admin password already set
    const storedPassword = localStorage.getItem("admin_password");
    if (storedPassword) {
      setAdminPasswordSet(true);
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "").trim();
    const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

    if (!password || !confirmPassword) {
      setStatus("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Store admin password
    localStorage.setItem("admin_password", password);
    setStatus("Admin password set successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  if (adminPasswordSet) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <p className="kicker">🔒 First-Time Setup Required</p>
        <h2 style={{ marginTop: "0.5rem" }}>Configure Admin Password</h2>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Set a secure password for the admin account before you can access the admin panel.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: "1rem",
              background: "#f0f8ff",
              borderRadius: "6px",
              marginBottom: "1.5rem",
              border: "1px solid #2196F3",
            }}
          >
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>Admin Email:</p>
            <p style={{ margin: 0, color: "#2196F3", fontFamily: "monospace" }}>
              admin@shoe-otah.com
            </p>
          </div>

          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Admin Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />

          <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            minLength={8}
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              marginBottom: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? "Setting up..." : "Set Admin Password"}
          </button>

          {status && (
            <p
              style={{
                marginTop: "1rem",
                padding: "0.75rem",
                background: status.includes("successfully") ? "#e8f5e9" : "#ffebee",
                color: status.includes("successfully") ? "#2e7d32" : "#c62828",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}
            >
              {status}
            </p>
          )}
        </form>

        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#fff3cd",
            borderRadius: "6px",
            fontSize: "0.85rem",
            color: "#666",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0", fontWeight: "600" }}>🔐 Tips:</p>
          <ul style={{ margin: 0, paddingLeft: "1.5rem", fontSize: "0.85rem" }}>
            <li>Use a strong, unique password</li>
            <li>Do not share your credentials</li>
            <li>You can change this later in admin settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
