// app/contexts/AuthContext.tsx

"use client";

import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  role: string | null;
  token: string | null;
  setAuthData: (user_id: string, role: string) => void;
  clearAuthData: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  role: null,
  token: null,
  setAuthData: () => {},
  clearAuthData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state from localStorage
  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  });

  const [role, setRole] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role");
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  });

  const setAuthData = (user_id: string, role: string) => {
    try {
      setUserId(user_id);
      setRole(role);
      // Save to localStorage
      localStorage.setItem("userId", user_id);
      localStorage.setItem("role", role);
    } catch (error) {
      console.error("Failed to set auth data:", error);
    }
  };

  const clearAuthData = () => {
    setUserId(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ userId, role, token, setAuthData, clearAuthData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
