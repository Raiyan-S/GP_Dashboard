import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Importing the AuthContext to access authentication state

// Used in App.jsx
// This component is used to protect routes in the application
// It checks if the user is authenticated and authorized to access the route
const ProtectedRoute = ({ element, allowedRoles, fetchAuth }) => {
  const { isAuthenticated, loading, userRole } = useContext(AuthContext); 
  const [backendAuthorized, setBackendAuthorized] = useState(true); // Backend authorization

  // Check if the user is authenticated from the backend
  useEffect(() => {
    const checkBackendAuth = async () => {
      // If fetchAuth is not provided, skip the check
      if (!fetchAuth) {
        return;
      }
      try {
        await fetchAuth(); // Call the backend-protected endpoint
        setBackendAuthorized(true); // If the call is successful, set backendAuthorized to true
      } catch (error) {
        if (error.response.status === 403) { // Forbidden error
          setBackendAuthorized(false); // If the user is not authorized, set backendAuthorized to false
        }
      } 
    };

    checkBackendAuth(); // Call function
  }, [fetchAuth]); // Effect runs when fetchAuth changes 

  // if it's loading, show a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check from both frontend and backend if the user is authorized, if not, redirect to unauthorized page
  if (!allowedRoles.includes(userRole) || !backendAuthorized) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }

  return element; // return the element if the user is authenticated and authorized
};

export default ProtectedRoute;