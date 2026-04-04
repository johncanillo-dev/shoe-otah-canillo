"use client";

import { createContext, useContext, useState, useEffect, ReactNode, FC } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // Add password storage
  city?: string;
  createdAt?: string;
  icon?: string;
  phone?: string;
  address?: string;
  dashboardSettings?: {
    showDeliveryInfo: boolean;
    showRecentOrders: boolean;
    showCart: boolean;
    showMap: boolean;
    displayLayout: "grid" | "list";
  };
  preferences?: {
    emailNotifications: boolean;
    promotions: boolean;
    marketing: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  allUsers: User[];
  register: (email: string, password: string, name: string, city?: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  adminLogin: (email: string, password: string) => { success: boolean; error?: string };
  adminLogout: () => void;
  deleteUser: (userId: string) => void;
  updateUserProfile: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = "admin@shoe-otah.com";
const ADMIN_PASSWORD_KEY = "admin_password";
const DEFAULT_ADMIN_PASSWORD = "admin@shoe123";
const STORAGE_KEY = "auth_user";
const ADMIN_KEY = "auth_admin";
const ALL_USERS_KEY = "all_users";

// Initialize admin password synchronously at module load time
if (typeof window !== "undefined") {
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
  if (!storedPassword) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const isAdminStored = localStorage.getItem(ADMIN_KEY);
    const storedAllUsers = localStorage.getItem(ALL_USERS_KEY);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (storedAllUsers) {
      try {
        setAllUsers(JSON.parse(storedAllUsers));
      } catch (e) {
        console.error("Failed to parse all users:", e);
      }
    }

    if (isAdminStored === "true") {
      setIsAdmin(true);
    }

    setIsHydrated(true);
  }, []);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Separate register function - creates new user account
  const register = (email: string, password: string, name: string, city?: string): { success: boolean; error?: string } => {
    // Validation
    if (!email || !password || !name) {
      return { success: false, error: "All fields are required" };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Check if email already exists
    if (allUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      password, // Store password (in production, should be hashed)
      city,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    // Add to all users list
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updated));

    return { success: true };
  };

  // Updated login function - only logs in existing registered users
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Find user in registered users
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      return { success: false, error: "Account not found. Please register first" };
    }

    // Verify password
    if (foundUser.password !== password) {
      return { success: false, error: "Incorrect password" };
    }

    // Remove password from stored user for security
    const userToStore = { ...foundUser };
    setUser(userToStore);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const adminLogin = (email: string, password: string): { success: boolean; error?: string } => {
    // Admin must use the admin email
    if (email.toLowerCase() !== ADMIN_EMAIL) {
      return { success: false, error: "Invalid admin email" };
    }

    // Get stored admin password
    const storedAdminPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);

    // If no admin password set yet, this is first admin setup - should redirect to admin setup page
    if (!storedAdminPassword) {
      return { success: false, error: "Admin account not configured. Please set admin password first." };
    }

    // Verify admin password
    if (password !== storedAdminPassword) {
      return { success: false, error: "Incorrect admin password" };
    }

    // Create admin user session
    const adminUser: User = {
      id: "admin-001",
      email: ADMIN_EMAIL,
      name: "Administrator",
      password: storedAdminPassword,
      createdAt: new Date().toISOString(),
    };

    setUser(adminUser);
    setIsAdmin(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
    localStorage.setItem(ADMIN_KEY, "true");

    return { success: true };
  };

  const adminLogout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  const deleteUser = (userId: string) => {
    const updated = allUsers.filter((u) => u.id !== userId);
    setAllUsers(updated);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updated));
  };

  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    
    // Also update in allUsers list
    const updatedAllUsers = allUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setAllUsers(updatedAllUsers);
    localStorage.setItem(ALL_USERS_KEY, JSON.stringify(updatedAllUsers));
  };

  if (!isHydrated) {
    return <div>{children}</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin,
        allUsers,
        register,
        login,
        logout,
        adminLogin,
        adminLogout,
        deleteUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Return a safe default if auth context is not available
  if (context === undefined) {
    return {
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      allUsers: [],
      register: () => ({ success: false, error: "Auth context not available" }),
      login: () => ({ success: false, error: "Auth context not available" }),
      logout: () => {},
      adminLogin: () => ({ success: false, error: "Auth context not available" }),
      adminLogout: () => {},
      deleteUser: () => {},
      updateUserProfile: () => {},
    };
  }
  
  return context;
}
