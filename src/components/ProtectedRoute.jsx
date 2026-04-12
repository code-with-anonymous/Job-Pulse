import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still resolving the session — render nothing (avoids redirect flicker)
  if (loading) return null;

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
