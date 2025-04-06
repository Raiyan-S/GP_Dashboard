import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verify_token, logout } from "../../services/api"; // Importing verify_token and logout functions from the API service

// Context is a React object that allows you to share values between components without having to pass props down manually at every level
export const AuthContext = createContext(); 

// Used in main.jsx
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // State to manage authentication status
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [userRole, setUserRole] = useState(null); // State to manage user role
  const [username, setUsername] = useState(null); // State to manage username
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); 

  // Function to handle logout
  // This function calls the logout function from the API service to log the user out
  const logoutt = async () => {
    try {
      await logout(); // Call the logout function to log the user out
      setIsAuthenticated(false); // Set the authentication state to false
      setUserRole(null); // Clear the user role
      setUsername(null); // Clear the username
      sessionStorage.clear(); // Clear session storage items related to user data
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Failed to logout:", error); 
    }
  };

  // Function to refresh authentication state
  // This function checks if the user is authenticated by calling the backend API
  const refreshAuthState = async () => {
    try {
      const response = await verify_token(); // Call the verify_token function to check if the user's session token is valid
      // If the response is ok, set the authentication state to true and get the user role and username
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

  // Effect to check the authentication state when the component mounts or when the pathname changes 
  // (e.g., when the user navigates to a different route)
  useEffect(() => {
    const checkSession = async () => {
      // If the user is on the login, register, or root path (if that's the case), set loading to false and don't check the session
      // This is to avoid unnecessary API calls when the user is on these pages
      if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") {
        setLoading(false);
        return;
      }
      // If the user is on any other path, check the session
      await refreshAuthState();
      setLoading(false);
    };

    checkSession(); // Call function
  }, [location.pathname]); // Run the check when the pathname changes

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, userRole, username, logoutt, refreshAuthState }}> {/* Provide the authentication state and functions to the children components */}
      {loading ? <p>Loading...</p> : children} {/* Render only 'Loading...' on the page if the user is still being authenticated*/}
    </AuthContext.Provider>
  );
};