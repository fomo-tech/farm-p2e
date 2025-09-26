import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthApp } from "store/useAuthApp";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { logged } = useAuthApp();
  const location = useLocation();

  if (!logged) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return element;
};

export default PrivateRoute;
