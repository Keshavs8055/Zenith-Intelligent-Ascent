"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { Session, RegisterUserSchema, LoginSchema } from "@zenith/types";
import { z } from "zod";

interface AuthContextType {
  user: Session["user"] | null;
  loading: boolean;
  login: (data: z.infer<typeof LoginSchema>) => Promise<void>;
  signup: (data: z.infer<typeof RegisterUserSchema>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Session["user"] | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage to persist auth state visually 
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("zenith_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      // Safely ignore storage persistence failure policies 
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (data: z.infer<typeof LoginSchema>) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.user) {
      setUser(res.data.user);
      try {
        localStorage.setItem("zenith_user", JSON.stringify(res.data.user));
      } catch (e) {}
    } else {
      throw new Error("Invalid response format received from API.");
    }
  };

  const signup = async (data: z.infer<typeof RegisterUserSchema>) => {
    const res = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.user) {
      setUser(res.data.user);
      localStorage.setItem("zenith_user", JSON.stringify(res.data.user));
    } else {
      throw new Error("Invalid response format received from API.");
    }
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    try {
      localStorage.removeItem("zenith_user");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
