import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Instead of redirecting to homepage, redirect to dashboard which is role-neutral
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;