import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ConsumerForm from "../consumer/consumer_form_component";
import EmployeeForm from "../employee/employee_form_component";

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
      let role = consumerInfo?.role || "";

      // CONSUMER
      if (role === "CONSUMER") {
        navigate("/consumer-dashboard", { replace: true });
        return;
      }
      
      return;
    }

    // Authenticated employee with existing profile
    if (employeeInfo) {
      let role = employeeInfo?.role || "";

      // USER or HR
      if (role === "USER" || role === "HR") {
        navigate("/dashboard", { replace: true });
        return;
      }

      // EDITOR
      if (role === "EDITOR") {
        navigate("/editor-dashboard", { replace: true });
        return;
      }

      // ADMIN
      if (role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
        return;
      }

      return;
    }
    // User exists but has no consumer/employee information
    // ConsumerForm will be displayed
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
  }

  // User exists but has no profile
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      {user && user.app_metadata.provider === "google" && !consumerInfo && 
        <ConsumerForm 
          ID={user.id} 
          onSuccess={handleFormResponse}
        />
      }
      {user && user.app_metadata.provider === "email" && !employeeInfo && 
        <EmployeeForm 
          ID={user.id}
          onSuccess={handleFormResponse}
        />
      }
    </div>
  );
}

export default AuthCallback;