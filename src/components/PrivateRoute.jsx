import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * PrivateRoute component
 * Protects admin routes from unauthorized access
 * Only allows users with valid admin token and role
 */
export default function PrivateRoute({ children, requiredRole = null }) {
  const { admin, loading, isAdmin } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!admin || !admin.token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin role
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check specific role requirement if provided
  if (requiredRole && admin.role !== requiredRole) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}