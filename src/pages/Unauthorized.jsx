import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Unauthorized() {
    const navigate = useNavigate();
    const { employeeInfo } = useAuth();

    const role = employeeInfo?.role;

    const goTo = () => {
        if (!role) {
            return alert("Role not found, Please try again.");
        }
        if (role === "USER" || role === "HR") {
            navigate("/dashboard", { replace: true });
        }else if (role === "EDITOR") {
            navigate("/editor-dashboard", { replace: true });
        }else if (role === "ADMIN") {
            navigate("/admin-dashboard", { replace: true });
        }else {
            alert("Dashboard Not Found.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl border border-slate-200">
            
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert
                size={42}
                className="text-red-500"
            />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-slate-900">
            Access Denied
            </h1>

            {/* Description */}
            <p className="mt-3 text-slate-500">
            You do not have permission to access this page.
            Please return to a page that is available to your account.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
                <ArrowLeft size={18} />
                Go Back
            </button>

            <button
                type="button"
                onClick={goTo}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
                <Home size={18} />
                Dashboard
            </button>
            </div>
        </div>
        </div>
    );
}

export default Unauthorized;