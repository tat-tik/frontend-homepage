// ProtectedRoute.jsx
import { Navigate } from "react-router";

const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/login',
  children,
}) => {
  // Простая проверка без задержки
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

export default ProtectedRoute;