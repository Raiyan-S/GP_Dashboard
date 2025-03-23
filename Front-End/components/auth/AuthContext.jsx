import React, { createContext, useState, useEffect } from 'react';
import { verify_token } from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await verify_token();
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          console.error("Token verification failed:", await response.json());
          setIsAuthenticated(false);
          // Cookies.remove('session_token');
        }
      } catch (error) {
        // setIsAuthenticated(false);
        // Cookies.remove('session_token');
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};