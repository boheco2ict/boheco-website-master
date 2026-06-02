import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/dashboard");
        return;
      }
    };

    checkStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    const validRegEx = /^[^\\&']*$/;
    if (!email.match(validRegEx)) {
      setMsg("Unauthorized email format");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pwd,
      });

      if (error) {
        setMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        navigate("/dashboard");
      }
    } catch (error) {
      setMsg("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-image2 min-h-screen flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-md">
        <form
          method="POST"
          className="bg-white/95 p-6 rounded-xl shadow-lg border border-slate-200"
          onSubmit={handleSubmit}
          aria-labelledby="login-heading"
        >
          <h1 id="login-heading" className="text-2xl font-extrabold text-slate-900 text-center">
            Employee Login
          </h1>
          <p className="mt-2 text-sm text-center text-slate-600">For BOHECO II employees only</p>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                placeholder="you@boheco2.com.ph"
                className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                autoComplete="email"
                autoFocus
                aria-label="Email address"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <div className="mt-1 relative">
                <input
                  type={show ? "password" : "text"}
                  name="password"
                  placeholder="Enter your password"
                  className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-slate-900 shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-pressed={!show}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>

            {msg && (
              <div role="alert" className="text-sm text-red-600">
                {msg}
              </div>
            )}

            <div>
              <button
                type="submit"
                className={`w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                  loading ? "bg-amber-400" : "bg-amber-600 hover:bg-amber-700"
                }`}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Login"}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-amber-600 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;
