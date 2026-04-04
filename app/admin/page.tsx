"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import AdminContent from "./admin-content";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin) {
      router.push("/login");
      return;
    }
    setIsAuthorized(true);
  }, [isAdmin, router]);

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
