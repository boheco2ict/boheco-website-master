import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt } from "react-icons/fa";
import EmployeeNoRecord from "../../components/employee/no_record";
import { supabase } from "../../services/supabase";
import { createConsumer } from "../../services/postservices";

function AuthCallback() {
  const navigate = useNavigate();

  const {
    user,
    employeeInfo,
    consumerInfo,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const handleAuth = async () => {
      // =========================================
      // EXISTING CONSUMER
      // =========================================

      if (consumerInfo) {
        const role = consumerInfo?.role || "";

        if (role === "CONSUMER") {
          navigate("/consumer-dashboard", {
            replace: true,
          });
          return;
        }
      }

      // =========================================
      // EXISTING EMPLOYEE
      // =========================================

      if (employeeInfo) {
        const role = employeeInfo?.role || "";

        if (
          role === "USER" ||
          role === "HR" ||
          role === "EDITOR" ||
          role === "ADMIN"
        ) {
          navigate("/dashboard", {
            replace: true,
          });
          return;
        }
      }

      // =========================================
      // GOOGLE USER WITHOUT ACCOUNT
      // =========================================

      if (
        user.app_metadata?.provider === "google" &&
        !consumerInfo &&
        !employeeInfo
      ) {
        try {
          const response = await createConsumer(user.id);
          if (response) {
            window.location.reload();
          }
          return;
        } catch (error) {
          console.error(error);
        }
      }
    };

    handleAuth();
  }, [
    loading,
    user,
    consumerInfo,
    employeeInfo,
    navigate,
  ]);

  // =========================================
  // LOADING
  // =========================================

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

  // =========================================
  // NO USER
  // =========================================

  if (!user) {
    return null;
  }

  // =========================================
  // EXISTING ACCOUNT
  // =========================================

  if (consumerInfo || employeeInfo) {
    return null;
  }

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    const confirm = window.confirm(
      "Are you sure you want to Logout? You will need to log in again to access your account."
    );

    if (!confirm) return;

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error(error);
    }

    navigate("/login");
  };

  // =========================================
  // GOOGLE USER CREATING ACCOUNT
  // =========================================

  if (
    user.app_metadata?.provider === "google" &&
    !consumerInfo &&
    !employeeInfo
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Setting up your account...
        </p>
      </div>
    );
  }

  // =========================================
  // EMAIL USER WITHOUT EMPLOYEE RECORD
  // =========================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative">
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

      {user.app_metadata?.provider === "email" &&
        !employeeInfo && <EmployeeNoRecord />}
    </div>
  );
}

export default AuthCallback;