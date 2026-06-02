import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });
    setLoading(true);

    const value = email.trim();
    if (!value) {
      setStatus({ message: "Please enter your email address.", type: "error" });
      setLoading(false);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setStatus({ message: "Enter a valid email address.", type: "error" });
      setLoading(false);
      return;
    }

    const validRegEx = /^[^\\&']*$/;
    if (!validRegEx.test(value)) {
      setStatus({ message: "Unauthorized email format.", type: "error" });
      setLoading(false);
      return;
    }

    const redirectUrl = process.env.REACT_APP_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(value, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setStatus({ message: error.message, type: "error" });
    } else {
      setStatus({
        message: "Password reset email sent. Please check your inbox.",
        type: "success",
      });
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div className="bg-image2 min-h-screen flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-md">
        <form
          method="POST"
          className="bg-white/95 p-6 rounded-xl shadow-lg border border-slate-200"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-extrabold text-slate-900 text-center">Forgot password?</h1>
          <p className="mt-2 text-sm text-center text-slate-600">
            Enter your email address and we’ll send a secure reset link to help you regain access.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email address</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@boheco2.com.ph"
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                required
                autoComplete="email"
                aria-label="Email address"
              />
            </label>

            {status.message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  status.type === "error"
                    ? "bg-red-500/10 text-red-700 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-900 border border-amber-500/20"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                loading ? "bg-amber-400" : "bg-amber-600 hover:bg-amber-700"
              }`}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Send reset link"}
            </button>

            <div className="text-center text-sm">
              <Link to="/login" className="text-amber-600 font-medium hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ForgotPassword;
