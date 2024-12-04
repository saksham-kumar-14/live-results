import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: Boolean;
}


const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated, children }) => {

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/admin" replace />
  );
};

export default PrivateRoute;

