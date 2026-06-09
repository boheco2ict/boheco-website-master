import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRecovery = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        navigate("/login");
        return;
      }

      setAllowed(true);
      setLoading(false);
    };

    checkRecovery();
  }, [navigate]);

  if (loading) {
    return (
      <div className="bg-image2 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-900/10">
          <p className="text-center text-sm text-slate-700">Verifying reset session…</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!pwd || !confirm) {
      setMsg("Please fill in both password fields.");
      return;
    }

    if (pwd !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    if (pwd.length < 8) {
      setMsg("Password should be at least 8 characters long.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pwd });

    if (error) {
      setMsg(error.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="bg-image2 min-h-screen px-4 py-10 flex items-center justify-center text-slate-900">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-900/10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Reset password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use the recovery session to create a new secure password for your account.
          </p>
          <p className="mt-4 inline-flex rounded-2xl bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
            For BOHECO&nbsp;II employees only
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">
              New password
            </label>
            <div className="relative mt-2">
              <input
                id="new-password"
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setShow((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-900"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <div className="relative mt-2">
              <input
                id="confirm-password"
                type={confirmShow ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setConfirmShow((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-900"
                aria-label={confirmShow ? "Hide password" : "Show password"}
              >
                {confirmShow ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {msg && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {msg}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Update password
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-amber-600 underline transition hover:text-amber-800">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
