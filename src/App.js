import React from "react";
import Home from "./pages/others/Home";
import About from "./pages/others/About";
import Advisory from "./pages/others/Advisory";
import Partners from "./pages/others/Partners";
import LifelineAdvisory from "./pages/others/LifelineAdvisory";
import NeaAdvisory from "./pages/others/Notice";
import { Route, Routes, Navigate } from "react-router-dom";
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
import ConsumerDashboard from "./pages/consumer/consumer_dashboard";
import Policy from "./pages/employee/Policy";
import EmployeeManual from "./pages/employee/EmployeeManual";
import ForgotPassword from "./pages/others/ForgotPassword";
import Settings from "./pages/others/Settings";
import Unauthorized from "./pages/others/Unauthorized";
import InstallPrompt from "./components/InstallPrompt";
import ReviewApplication from "./components/dashboard/ui/ReviewApplication";
import { useAuth } from "./context/AuthContext";
import AuthCallback from "./pages/auth/auth_callback";
import Header from "./components/Header";
import AdminDashboard from "./pages/admin/admin_dashboard";
import EmployeeLayout from "./pages/EmployeeLayout";
import ConsumerLayout from "./pages/ConsumerLayout";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const RootRedirect = () => {
    if (user) {
      return <Navigate to="/auth/callback" replace />;
    } else {
      return <Home />;
    }
  };

  return (
    <div>
      <PrivacyPopup />
      <InstallPrompt />

      {/* Public Header */}
      {!user && <Header />}

      <Routes>
        <Route path="/">
          
          {/* ============================= */}
          {/* PUBLIC ROUTES */}
          {/* ============================= */}

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
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route
            path="auth/callback"
            element={
              <ProtectedRoute>
                <AuthCallback />
              </ProtectedRoute>
            }
          />

          {/* ============================= */}
          {/* EMPLOYEE LAYOUT */}
          {/* USER / HR / ADMIN / EDITOR */}
          {/* ============================= */}

          <Route element={<EmployeeLayout />}>

            {/* USER / HR */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["USER", "HR"]}>
                    <Dashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="admin-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* EDITOR */}
            <Route
              path="editor-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["EDITOR"]}>
                    <EditorDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* USER / HR */}
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
                  <RoleRoute allowedRoles={["USER", "HR", "ADMIN", "EDITOR"]}>
                    <Settings />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="coop-policies"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["USER", "HR", "ADMIN", "EDITOR"]}>
                    <Policy />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="employee-manuals"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["USER", "HR", "ADMIN", "EDITOR"]}>
                    <EmployeeManual />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

          </Route>


          {/* ============================= */}
          {/* CONSUMER ROUTES */}
          {/* ============================= */}
          <Route element={<ConsumerLayout />}>

            <Route
              path="consumer-dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["CONSUMER"]}>
                    <ConsumerDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="consumer-settings"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={["CONSUMER"]}>
                    <Settings />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

          </Route>
        </Route>

        {/* ============================= */}
        {/* CATCH ALL */}
        {/* ============================= */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;