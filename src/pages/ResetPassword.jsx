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
        <div className="max-w-md rounded-3xl border border-slate-700 bg-slate-950/95 p-8 shadow-2xl shadow-slate-900/40">
          <p className="text-center text-sm text-slate-300">Verifying reset session…</p>
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
    <div className="bg-image2 min-h-screen px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-[32px] border border-slate-700 bg-slate-950/95 p-8 shadow-2xl shadow-slate-900/40">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-white">Reset password</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Use the recovery session to create a new secure password for your account.
          </p>
          <p className="mt-4 rounded-2xl bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
            For BOHECO&nbsp;II employees only
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleReset}>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-slate-200">
              New password
            </label>
            <div className="relative mt-2">
              <input
                id="new-password"
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setShow((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition hover:text-slate-100"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <div className="relative mt-2">
              <input
                id="confirm-password"
                type={confirmShow ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 pr-12 text-sm text-slate-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="button"
                onClick={() => setConfirmShow((current) => !current)}
                className="absolute inset-y-0 right-3 inline-flex items-center text-slate-400 transition hover:text-slate-100"
                aria-label={confirmShow ? "Hide password" : "Show password"}
              >
                {confirmShow ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {msg && (
            <div className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {msg}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Update password
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Remembered your password?{" "}
          <Link to="/login" className="font-semibold text-white underline transition hover:text-amber-200">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
