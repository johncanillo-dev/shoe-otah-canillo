"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSeller } from "@/lib/seller-context";
import { QuickUserSettings } from "@/app/components/quick-user-settings";
import { QuickSellerSettings } from "@/app/components/quick-seller-settings";
import { QuickAdminSettings } from "@/app/admin/quick-admin-settings";

function HeaderContent() {
  const { user, isLoggedIn, isAdmin, logout, adminLogout } = useAuth();
  const { seller, isSellerLoggedIn, sellerLogout } = useSeller();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/seller-register";

  return (
    <>
      {isSellerLoggedIn && seller && !isAuthPage ? (
        <>
          {/* Seller Navigation */}
          <Link href="/">Shop</Link>
          <Link href="/seller" style={{ fontWeight: "600", color: "var(--accent)" }}>
            🏪 Seller Dashboard
          </Link>

          {/* Seller Account Section */}
          <span className="user-info" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            🏪 {seller.name}
            <button
              onClick={() => {
                sellerLogout();
              }}
              className="btn-logout"
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                marginLeft: "0.5rem",
                textDecoration: "underline",
              }}
            >
              Logout
            </button>
            <QuickSellerSettings />
          </span>
        </>
      ) : isLoggedIn && !isAuthPage ? (
        <>
          {/* Regular User Navigation */}
          {!isAdmin && (
            <>
              <Link href="/">Shop</Link>
              <Link href="/cart">Cart</Link>
              <Link href="/dashboard" style={{ fontWeight: "600", color: "var(--accent)" }}>
                📊 My Dashboard
              </Link>
            </>
          )}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <Link href="/admin" style={{ fontWeight: "600", color: "var(--accent)" }}>
                📊 Admin Dashboard
              </Link>
            </>
          )}

          {/* User Account Section - For Regular Users Only */}
          {!isAdmin && (
            <span className="user-info" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              👤 Welcome, {user?.name}!
              <button
                onClick={logout}
                className="btn-logout"
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  marginLeft: "0.5rem",
                  textDecoration: "underline",
                }}
              >
                Logout
              </button>
              <QuickUserSettings />
            </span>
          )}

          {/* User Account Section - For Admins Only */}
          {isAdmin && (
            <>
              <span className="user-info" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                🔐 Admin: {user?.name}!
                <button
                  onClick={adminLogout}
                  className="btn-admin-logout"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                    marginLeft: "0.5rem",
                    textDecoration: "underline",
                    fontWeight: "600",
                  }}
                >
                  Exit Admin Mode
                </button>
              </span>
              <QuickAdminSettings />
            </>
          )}
        </>
      ) : (
        <>
          <Link href="/register">Create Account</Link>
          <Link href="/login">Login</Link>
        </>
      )}
    </>
  );
}

export default function LayoutClient() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          shoe-otah Boutique
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <HeaderContent />
        </nav>
      </div>
    </header>
  );
}
