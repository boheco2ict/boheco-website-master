import React from "react";
import { Navigate } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user, loading } = useAuth();

  // While auth is loading, show nothing to avoid flicker.
  if (loading) return null;

  // If the user is authenticated, redirect to the dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="bg-image2 flex flex-col items-center justify-center">
      <LandingPage />
    </div>
  );
};

export default Hero;
