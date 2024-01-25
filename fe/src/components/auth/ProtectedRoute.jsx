import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../layout/Loader';

const ProtectedRoute = ({ children, admin }) => {
  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);

  if (isLoading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (admin && user?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute