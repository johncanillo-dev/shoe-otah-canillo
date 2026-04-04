"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import DashboardContent from "./dashboard-content";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (isAdmin) {
      router.push("/admin");  // Redirect admins to admin dashboard
      return;
    }
    setIsAuthorized(true);
  }, [isAdmin, isLoggedIn, router]);

  if (!isAuthorized) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="kicker">Loading...</p>
        </div>
      </section>
    );
  }

  return <DashboardContent />;
}
