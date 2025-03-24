import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verify_token, logout } from "../../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await verify_token();
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserRole(data.role);
          setUsername(data.username);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch {
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const logoutt = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUserRole(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userRole, username,logoutt }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};