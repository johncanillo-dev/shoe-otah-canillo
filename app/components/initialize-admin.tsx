"use client";

import { useEffect } from "react";

/**
 * This component initializes the admin password in localStorage
 * Call this early in your app to ensure admin credentials are ready
 */
export function InitializeAdmin() {
  useEffect(() => {
    const ADMIN_PASSWORD_KEY = "admin_password";
    const DEFAULT_ADMIN_PASSWORD = "admin@shoe123";
    
    const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!storedPassword) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
      console.log("✅ Admin password initialized: " + DEFAULT_ADMIN_PASSWORD);
    }
  }, []);

  return null;
}
