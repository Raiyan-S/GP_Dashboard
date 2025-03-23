import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { verify_token } from '../../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('session_token');
      console.log('Token:', token);
      if (token) {
        try {
          const response = await verify_token();
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            Cookies.remove('session_token');
          }
        } catch (error) {
          setIsAuthenticated(false);
          Cookies.remove('session_token');
        }
      }
    };
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};