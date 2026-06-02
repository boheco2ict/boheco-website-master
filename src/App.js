import React from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Advisory from "./pages/Advisory";
import Partners from "./pages/Partners";
import LifelineAdvisory from "./pages/LifelineAdvisory";
import NeaAdvisory from "./pages/Notice";
import { Route, Routes, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import DdpPspp from "./pages/DdpPspp";
import BillInquiry from "./pages/BillInquiry";
import Policy from "./pages/Policy";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Award from "./pages/Award";
import PrivacyPopup from "./components/PrivacyPopup";
import Dashboard from "./pages/auth/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <div className="pt-[76px]">
      <Navigation />
      <PrivacyPopup />
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="rate-advisory" element={<Advisory />} />
          <Route path="notice" element={<NeaAdvisory />} />
          <Route path="ddpandpspp" element={<DdpPspp />} />
          <Route path="partners" element={<Partners />} />
          <Route path="inquiries" element={<BillInquiry />} />
          <Route path="lifeline" element={<LifelineAdvisory />} />
          <Route path="awards" element={<Award />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="coop-policies"
            element={
              <ProtectedRoute>
                <Policy />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
