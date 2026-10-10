import React, { createContext, useContext, useState, useEffect } from "react";
import { apiGetMe, apiLogin, apiRegister, apiLogout } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      setLoading(true);
      const res = await apiGetMe();
      if (res && res.authenticated && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    setError(null);
    try {
      const res = await apiLogin({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      setError(err.message || "Failed to log in");
      return { success: false, message: err.message || "Failed to log in" };
    }
  }

  async function register(userData) {
    setError(null);
    try {
      const res = await apiRegister(userData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (err) {
      setError(err.message || "Registration failed");
      return { success: false, message: err.message || "Registration failed" };
    }
  }

  async function logout() {
    try {
      await apiLogout();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
