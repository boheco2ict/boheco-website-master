import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles }) {
  const { user, employeeInfo, consumerInfo, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
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

  /*
   * CONSUMER
   *
   * If the route allows CONSUMER, check consumerInfo
   * instead of employeeInfo.
   */
  if (allowedRoles.includes("CONSUMER")) {
    if (!consumerInfo) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  }

  /*
   * EMPLOYEE
   *
   * Employee routes continue using employeeInfo.role.
   */
  if (!employeeInfo) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        Loading employee information...
      </div>
    );
  }

  // Logged in but wrong employee role
  if (!allowedRoles.includes(employeeInfo.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;