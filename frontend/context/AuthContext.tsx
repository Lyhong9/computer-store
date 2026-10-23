"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import apiClient from "@/lib/axios";

export type AppRole = "ADMIN" | "CUSTOMER" | "STAFF" | "GUEST";

export interface AppUserSession {
  id: number;
  username: string;
  email: string;
  role: AppRole;
  roles: string[];
  customerId?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  clerkId?: string;
  token?: string;
}

export interface AuthContextType {
  user: AppUserSession | null;
  role: AppRole;
  effectiveRole: AppRole;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  previewRole: AppRole | null;
  setPreviewRole: (role: AppRole | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const [user, setUser] = useState<AppUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewRole, setPreviewRole] = useState<AppRole | null>(null);

  const refreshUser = useCallback(async () => {
    if (!isSignedIn || !clerkUser) {
      setUser(null);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        delete apiClient.defaults.headers.common["Authorization"];
      }
      return;
    }

    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const role = (data.role || "CUSTOMER").toUpperCase() as AppRole;
        const roles = (data.roles || [role]).map((r: string) => r.toUpperCase());

        const sessionUser: AppUserSession = {
          id: data.id || data.customerId || 0,
          username: data.username || clerkUser.username || "user",
          email: data.email || clerkUser.primaryEmailAddress?.emailAddress || "",
          role,
          roles,
          customerId: data.customerId || null,
          firstName: data.firstName || clerkUser.firstName || "",
          lastName: data.lastName || clerkUser.lastName || "",
          phone: data.phone || null,
          address: data.address || null,
          city: data.city || null,
          clerkId: clerkUser.id,
          token: data.token,
        };

        setUser(sessionUser);

        if (data.token && typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.token);
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        }
      } else {
        // Fallback to clerk metadata if backend me endpoint is unreachable
        const fallbackRole = ((clerkUser.publicMetadata?.role as string) || "CUSTOMER").toUpperCase() as AppRole;
        setUser({
          id: 0,
          username: clerkUser.username || "user",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          role: fallbackRole,
          roles: [fallbackRole],
          clerkId: clerkUser.id,
        });
      }
    } catch (err) {
      console.warn("Failed to synchronize user session with backend:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, clerkUser]);

  useEffect(() => {
    if (clerkLoaded) {
      refreshUser();
    }
  }, [clerkLoaded, refreshUser]);

  const baseRole: AppRole = user ? user.role : "GUEST";
  const effectiveRole: AppRole = previewRole || baseRole;
  const isAdmin = effectiveRole === "ADMIN";
  const isCustomer = effectiveRole === "CUSTOMER";
  const isAuthenticated = !!user && !!isSignedIn;

  return (
    <AuthContext.Provider
      value={{
        user,
        role: baseRole,
        effectiveRole,
        isAdmin,
        isCustomer,
        isAuthenticated,
        isLoading: !clerkLoaded || isLoading,
        previewRole,
        setPreviewRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
