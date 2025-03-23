import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuth } = useContext(AuthContext);

  useEffect(() => {
    console.log("Checking authentication...");
    checkAuth();
  }, []); // Runs when the component mounts

  console.log("Auth state:", { isAuthenticated, loading });

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
