import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleRoute({ children, allowedRoles = [] }) {
  const {
    user,
    employeeInfo,
    consumerInfo,
    loading,
  } = useAuth();

  const location = useLocation();

  // =========================================
  // AUTHENTICATION / PROFILE LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

          <p className="text-sm font-medium text-slate-500">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // NOT AUTHENTICATED
  // =========================================
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // =========================================
  // DETERMINE ACCOUNT TYPE
  // =========================================
  const isConsumer = !!consumerInfo;
  const isEmployee = !!employeeInfo;

  // =========================================
  // CONSUMER ROUTES
  // =========================================
  if (allowedRoles.includes("CONSUMER")) {
    // User must have a consumer profile
    if (!isConsumer) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Consumer is allowed
    return children;
  }

  // =========================================
  // EMPLOYEE ROUTES
  // =========================================
  if (allowedRoles.length > 0) {
    // User must have an employee profile
    if (!isEmployee) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Check employee role
    if (!allowedRoles.includes(employeeInfo.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  }

  // =========================================
  // NO ALLOWED ROLES SPECIFIED
  // =========================================
  return <Navigate to="/unauthorized" replace />;
}

export default RoleRoute;