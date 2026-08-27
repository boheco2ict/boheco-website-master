import React from "react";
import Home from "./pages/others/Home";
import About from "./pages/others/About";
import Advisory from "./pages/others/Advisory";
import Partners from "./pages/others/Partners";
import LifelineAdvisory from "./pages/others/LifelineAdvisory";
import NeaAdvisory from "./pages/others/Notice";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import DdpPspp from "./pages/others/DdpPspp";
import BillInquiry from "./pages/others/BillInquiry";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Award from "./pages/others/Award";
import Developers from "./pages/others/Developers";
import PrivacyPopup from "./components/PrivacyPopup";
import Dashboard from "./pages/employee/Dashboard";
import EditorDashboard from "./pages/editor/EditorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ConsumerDashboard from "./pages/consumer/consumer_dashboard";
import Policy from "./pages/employee/Policy";
import EmployeeManual from "./pages/employee/EmployeeManual";
import ForgotPassword from "./pages/others/ForgotPassword";
import ResetPassword from "./pages/others/ResetPassword";
import Settings from "./pages/others/Settings";
import Unauthorized from "./pages/others/Unauthorized";
import InstallPrompt from "./components/InstallPrompt";
import ReviewApplication from "./components/dashboard/ui/ReviewApplication";
import { useAuth } from "./context/AuthContext";
import AuthCallback from "./pages/auth/auth_callback";

function App() {
  const location = useLocation();

  const hideFooterOnRestrictedPages = [
    "/dashboard",
    "/editor-dashboard",
    "/admin-dashboard",
    "/consumer-dashboard",
    "/inquiries",
    "/reset-password",
    "/auth/callback",
  ].some((path) => location.pathname.startsWith(path));

  const RootRedirect = () => {
    const { employeeInfo, consumerInfo } = useAuth();
    let role = "";
    if (employeeInfo?.role) {
      role = employeeInfo.role;
    }else if (consumerInfo?.role) {
      role = consumerInfo.role;
    } else {
      role = "";
    }

    if (role === "USER" || role === "HR") {
      return <Navigate to="/dashboard" replace />;
    } else if (role === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (role === "EDITOR") {
      return <Navigate to="/editor-dashboard" replace />;
    } else if (role === "CONSUMER") {
      return <Navigate to="/consumer-dashboard" replace />;
    } else {
      return <Home />;
    }
  };

  return (
    <div>
      <Navigation />
      <PrivacyPopup />
      <InstallPrompt />
      <Routes>
        <Route path="/">
          <Route index element={<RootRedirect />} />
          <Route path="about" element={<About />} />
          <Route path="rate-advisory" element={<Advisory />} />
          <Route path="notice" element={<NeaAdvisory />} />
          <Route path="ddpandpspp" element={<DdpPspp />} />
          <Route path="partners" element={<Partners />} />
          <Route path="inquiries" element={<BillInquiry />} />
          <Route path="lifeline" element={<LifelineAdvisory />} />
          <Route path="awards" element={<Award />} />
          <Route path="developers" element={<Developers />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/consumer-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["CONSUMER"]}>
                  <ConsumerDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["EDITOR"]}>
                  <EditorDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER", "HR"]}>
                  <Dashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="review-application/:id"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER", "HR"]}>
                  <ReviewApplication />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="coop-policies" element={<Policy />} />
          <Route
            path="employee-manuals"
            element={
              <ProtectedRoute>
                <EmployeeManual />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideFooterOnRestrictedPages && <Footer />}
    </div>
  );
}

export default App;
// {!hideFooterOnRestrictedPages && <Footer />}