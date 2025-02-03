import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken'); // Adjust according to where you store the token

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default PrivateRoute;
