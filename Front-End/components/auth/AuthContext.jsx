import React, { createContext, useState, useEffect } from "react";
import { verify_token } from "../../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const response = await verify_token();
      
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        console.log("🔴 User not authenticated, redirecting to login...");
        setIsAuthenticated(false);
      } else {
        console.log("⚠️ Unexpected response:", response);
      }
    } catch (error) {
      console.log("🔴 Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
