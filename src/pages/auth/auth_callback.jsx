import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import ConsumerForm from "../consumer/form";
import EmployeeNoRecord from "../employee/no_record";
import { supabase } from "../../supabase";

function AuthCallback() {
  const navigate = useNavigate();
  const { user, employeeInfo, consumerInfo, loading } = useAuth();

  useEffect(() => {
    // Do absolutely nothing while AuthContext is loading
    if (loading) return;

    // No authenticated user
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Authenticated consumer with existing profile
    if (consumerInfo) {
      const role = consumerInfo?.role || "";

      // CONSUMER
      if (role === "CONSUMER") {
        navigate("/consumer-dashboard", { replace: true });
        return;
      }

      return;
    }

    // Authenticated employee with existing profile
    if (employeeInfo) {
      const role = employeeInfo?.role || "";

      // USER or HR
      if (role === "USER" || role === "HR" || role === "EDITOR" || role === "ADMIN") {
        navigate("/dashboard", { replace: true });
        return;
      }
      return;
    }

    // User exists but has no consumer/employee information
  }, [loading, user, consumerInfo, employeeInfo, navigate]);

  // Completely pause rendering while AuthContext is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">
            Checking your account...
          </p>
        </div>
      </div>
    );
  }

  // AuthContext finished loading, but no user
  if (!user) {
    return null;
  }

  // Existing consumer/employee will be redirected by useEffect
  if (consumerInfo || employeeInfo) {
    return null;
  }

  const handleFormResponse = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore errors
    }

    navigate("/login");
  };

  // User exists but has no profile
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="
          absolute top-6 right-6
          flex items-center gap-2
          px-4 py-2
          bg-white
          text-slate-700
          border border-slate-200
          rounded-lg
          shadow-sm
          hover:bg-slate-50
          hover:text-red-600
          transition-all duration-200
        "
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

      {/* Forms */}
      {user &&
        user.app_metadata.provider === "google" &&
        !consumerInfo && (
          <ConsumerForm
            ID={user.id}
            onSuccess={handleFormResponse}
          />
        )}

      {user &&
        user.app_metadata.provider === "email" &&
        !employeeInfo && (
          <EmployeeNoRecord data={user} />
        )}
    </div>
  );
}

export default AuthCallback;