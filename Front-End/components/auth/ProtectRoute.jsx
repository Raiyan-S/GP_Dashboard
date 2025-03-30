import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element, allowedRoles, fetchAuth }) => {
  const { isAuthenticated, loading, userRole } = useContext(AuthContext);
  const [backendAuthorized, setBackendAuthorized] = useState(true); // Backend authorization

  // Check if the user is authenticated from the backend
  useEffect(() => {
    const checkBackendAuth = async () => {
      if (!fetchAuth) {
        return;
      }
      try {
        await fetchAuth(); // Call the backend-protected endpoint
        setBackendAuthorized(true);
      } catch (error) {
        if (error.response.status === 403) {
          setBackendAuthorized(false);
        }
      } 
    };
    checkBackendAuth();
  }, [fetchAuth]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check from both frontend and backend if the user is authorized, if not, redirect to unauthorized page
  if (!backendAuthorized || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }

  return element;
};

export default ProtectedRoute;