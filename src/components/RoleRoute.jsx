import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, employeeInfo, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        Please Wait...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

// User is logged in, but employee information is not available
  if (!employeeInfo) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        Loading employee information...
      </div>
    );
  }

  // Logged in but wrong role
  if (!allowedRoles.includes(employeeInfo.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;