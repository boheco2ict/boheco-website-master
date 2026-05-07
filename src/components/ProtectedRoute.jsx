import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAuth(false);
          return;
        }

        const response = await axios.post(
          "https://bill-inquiry-api.onrender.com/api/v1/login/auth",
          {},
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (response.data.message === "Unauthorized") {
          localStorage.clear();
          setAuth(false);
        } else {
          setAuth(true);
        }
      } catch (error) {
        console.error(error);
        setAuth(false);
      }
    };

    checkAuth();
  }, []);
  // Loading
  if (auth === null) {
    return (
      <div className="h-screen flex justify-center items-center text-4xl">
        Please Wait...
      </div>
    );
  }
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
