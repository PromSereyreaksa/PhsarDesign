import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Check if the current route is the dashboard
  const isDashboardRoute = location.pathname === '/dashboard';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Special case for dashboard - only artists can access it
  if (isDashboardRoute && user?.role !== 'artist' && user?.role !== 'freelancer') {
    return <Navigate to="/home" replace />;
  }
  
  // For other role-restricted routes
  if (requiredRole && user?.role !== requiredRole) {
    // If it's not the dashboard, redirect to home page
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;