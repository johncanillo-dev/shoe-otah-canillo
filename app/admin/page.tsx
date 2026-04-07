"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import AdminContent from "./admin-content";

export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is admin - must be both logged in as admin
    if (!isAdmin || !user) {
      router.push("/login");
      return;
    }
    
    // Extra validation: user email should match admin email
    if (user.email !== "admin@shoe-otah.com") {
      router.push("/login");
      return;
    }
    
    setIsAuthorized(true);
  }, [isAdmin, user, router]);

  if (!isAuthorized) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Verifying access...</p>
          <p style={{ marginTop: "1rem", color: "#5e584d" }}>Loading admin panel...</p>
        </div>
      </section>
    );
  }

  return (
    <Suspense
      fallback={
        <section className="auth-shell">
          <div className="auth-card">
            <p className="kicker">Loading admin panel...</p>
          </div>
        </section>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
