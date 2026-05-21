import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  // Loading
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        Please Wait...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
