import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { isAuthenticated, loading, userRole } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page
  }

  return element;
};

export default ProtectedRoute;