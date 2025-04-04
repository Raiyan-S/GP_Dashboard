import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verify_token, logout } from "../../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const refreshAuthState = async () => {
    try {
      const response = await verify_token();
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserRole(data.role);
        setUsername(data.username);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") {
        setLoading(false);
        return;
      }

      await refreshAuthState();
      setLoading(false);
    };

    checkSession();
  }, [location.pathname]); // Run the check when the pathname changes

  const logoutt = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserRole(null);
      sessionStorage.removeItem("model-predictions");
      sessionStorage.removeItem("prediction-counter");
      sessionStorage.removeItem("selectedClient");
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userRole, username, logoutt, refreshAuthState }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};