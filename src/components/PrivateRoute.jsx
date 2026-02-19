import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return admin ? children : <Navigate to="/admin/login" />;
}