import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) return <Navigate to="/" replace />;

  // Wrong role
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === "staff" ? "/staff" : "/"} replace />;
  }

  // Allowed
  return children;
};

export default ProtectedRoute;