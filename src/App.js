import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Advisory from "./pages/Advisory";
import Partners from "./pages/Partners";
import LifelineAdvisory from "./pages/LifelineAdvisory";
import NeaAdvisory from "./pages/Notice";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import DdpPspp from "./pages/DdpPspp";
import BillInquiry from "./pages/BillInquiry";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Award from "./pages/Award";
import Developers from "./pages/Developers";
import PrivacyPopup from "./components/PrivacyPopup";
import Dashboard from "./pages/auth/Dashboard";
import EditorDashboard from "./pages/editor/EditorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Policy from "./pages/auth/Policy";
import EmployeeManual from "./pages/auth/EmployeeManual";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Settings from "./pages/Settings";
import Unauthorized from "./pages/Unauthorized";
import InstallPrompt from "./components/InstallPrompt";
import ReviewApplication from "./components/dashboard/ui/ReviewApplication";
import { useAuth } from "./context/AuthContext";

function App() {
  const location = useLocation();

  const hideFooterOnRestrictedPages = [
    "/dashboard",
    "/editor-dashboard",
    "/admin-dashboard",
    "/inquiries",
    "/reset-password",
  ].some((path) => location.pathname.startsWith(path));

  const RootRedirect = () => {
    const { employeeInfo } = useAuth();
    if (employeeInfo?.role === "USER" || employeeInfo?.role === "HR") {
      return <Navigate to="/dashboard" replace />;
    } 
    if (employeeInfo?.role === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    } 
    if (employeeInfo?.role === "EDITOR") {
      return <Navigate to="/editor-dashboard" replace />;
    } 
    return <Home />;
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
                <ReviewApplication />
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
