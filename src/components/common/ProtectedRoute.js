import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const userRolesString = localStorage.getItem("roles");
  const isAuthenticated = localStorage.getItem("jwtToken") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  let userRoles = [];
  try {
    userRoles = JSON.parse(userRolesString || "[]");
  } catch (error) {
    console.error("Error parsing user roles:", error);
    return <Navigate to="/login" />;
  }

  const hasRequiredRole = roles.some((role) => userRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
