"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to avoid flickering
  const [user, setUser] = useState(null);

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
  
  const getUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:3000/getUserInfo", {
        credentials: "include",
        method: "GET",
      });

      if(res.ok)
      {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      setUser(null);
    }
  };
  useEffect(() => {
    checkAuthStatus();
    getUserInfo();
  }, []);

  const login = async () => {
    await checkAuthStatus(); // Refresh the auth status on logina
    await getUserInfo();
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
