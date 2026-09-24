import { useEffect, useState } from "react";
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

  const [showDeactivatedMessage, setShowDeactivatedMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // CHECK ACCOUNT STATUS
  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const employeeDeactivated = employeeInfo && employeeInfo.isActive === false;
    const consumerDeactivated = consumerInfo && consumerInfo.isActive === false;

    if (employeeDeactivated || consumerDeactivated) {
      setShowDeactivatedMessage(true);
      setCountdown(5);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      const logoutTimer = setTimeout(() => {
        handleLogout();
      }, 5000);

      return () => {
        clearInterval(countdownInterval);
        clearTimeout(logoutTimer);
      };
    }

    setShowDeactivatedMessage(false);
    setCountdown(5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, employeeInfo, consumerInfo]);

  // AUTH ROUTING
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // Don't route deactivated accounts
    const employeeDeactivated = employeeInfo && employeeInfo.isActive === false;
    const consumerDeactivated = consumerInfo && consumerInfo.isActive === false;

    if (employeeDeactivated || consumerDeactivated) {
      return;
    }

    const handleRouting = async () => {
      // CONSUMER USER WITHOUT ACCOUNT
      if (user.app_metadata?.provider === "google" && !consumerInfo && !employeeInfo) {
        try {
          const response = await createConsumer(user.id);

          if (response) {
            window.location.reload();
          }

          return;
        } catch (error) {
          console.error("Error creating consumer:", error);
          return;
        }
      }

      // CONSUMER
      if (consumerInfo) {
        navigate("/consumer-dashboard", { replace: true });
        return;
      }

      // EMPLOYEE
      if (employeeInfo && employeeInfo?.employee?.empnumber) {
        navigate("/dashboard", { replace: true });
        return;
      }
    };

    handleRouting();
  }, [loading, user, consumerInfo, employeeInfo, navigate]);

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="text-slate-600">Checking your account...</p>
        </div>
      </div>
    );
  }

  // NO USER
  if (!user) {
    return null;
  }

  // DEACTIVATED ACCOUNT
  if (showDeactivatedMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <svg className="h-7 w-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14A2 2 0 003.82 21h16.36a2 2 0 001.71-3.14l-8.18-14a2 2 0 00-3.42 0z" />
            </svg>
          </div>

          <h2 className="mt-4 text-lg font-bold text-red-600">Account Deactivated</h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your account has been deactivated by the administrator.
          </p>

          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">You will be logged out automatically in</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {countdown} {countdown === 1 ? "second" : "seconds"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // EMPLOYEE WITHOUT EMPLOYEE RECORD
  if (user.app_metadata?.provider === "email" && (!employeeInfo || !employeeInfo?.employee?.empnumber)) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-slate-100">
        {/* Logout */}
        <button type="button" onClick={handleLogout} className="absolute right-6 top-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

        <EmployeeNoRecord />
      </div>
    );
  }

  // GOOGLE ACCOUNT BEING CREATED
  if (user.app_metadata?.provider === "google" && !consumerInfo && !employeeInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
          <p className="text-sm text-slate-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;