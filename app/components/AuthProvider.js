"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to avoid flickering

  const checkAuthStatus = async () => {
    try {
      const res = await fetch("http://localhost:3000/authenticate", {
        credentials: "include",
        method: "GET",
      });

      if(res.ok)
      {
        setIsAuthenticated(res.ok);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async () => {
    await checkAuthStatus(); // Refresh the auth status on login
  };

  const logout = async () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
