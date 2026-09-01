import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
// import { getEmployeeByUserId, getConsumerByUserId } from "../../services/getservices";

function Login() {
  // =========================================================
  // EXISTING EMPLOYEE STATES - UNCHANGED
  // =========================================================
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  // =========================================================
  // CONSUMER STATES - NEW
  // =========================================================
  const [loginType, setLoginType] = useState("employee");
  const [consumerMsg, setConsumerMsg] = useState("");
  const [consumerLoading, setConsumerLoading] = useState(false);
  const navigate = useNavigate();

  // =========================================================
  // EXISTING SESSION CHECK - UNCHANGED
  // =========================================================
  useEffect(() => {
    const checkStatus = async () => {
      const {data: { session },} = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/auth/callback", { replace: true });
      }
    };
    checkStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================================================
  // EXISTING EMPLOYEE LOGIN - UNCHANGED
  // =========================================================
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
        email,
        password: pwd,
      });

      if (error) {
        setMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        navigate("/auth/callback", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMsg("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CONSUMER LOGIN - NEW
  // =========================================================
  const handleGoogleLogin = async () => {
    try {
      setConsumerMsg("");
      setConsumerLoading(true);

      const redirectUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:3000/auth/callback"
          : "https://www.boheco2.com.ph/auth/callback";

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        setConsumerMsg(error.message);
        setConsumerLoading(false);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setConsumerMsg("Unable to sign in with Google.");
      setConsumerLoading(false);
    }
  };

  return (
    <div
      className="pb-5 min-h-screen pt-[96px] px-5 flex items-center justify-center"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">

        <div className="grid lg:grid-cols-2 min-h-[650px]">

          {/* =====================================================
              LEFT SIDE - BOHECO II BRANDING
          ===================================================== */}
          <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-10 text-white">

            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col justify-between w-full">

              {/* Brand */}
              <div>
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg">
                    <span className="text-xl font-black text-amber-600">
                      B2
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold tracking-wide">
                      BOHECO II
                    </h2>

                    <p className="text-xs text-amber-100">
                      Bohol Electric Cooperative II
                    </p>
                  </div>

                </div>
              </div>

              {/* Main branding */}
              <div className="max-w-md">

                <div className="mb-5 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  Secure Access Portal
                </div>

                <h1 className="text-4xl font-extrabold leading-tight">
                  Powering
                  <br />
                  Communities.
                </h1>

                <p className="mt-5 text-base leading-7 text-amber-50">
                  Access the BOHECO II online portal to manage your
                  account, services, and important information securely.
                </p>

              </div>

              {/* Footer */}
              <div>

                <div className="h-px w-full bg-white/20" />

                <p className="mt-5 text-xs text-amber-100">
                  © {new Date().getFullYear()} Bohol Electric Cooperative II
                </p>

              </div>

            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE - LOGIN
          ===================================================== */}
          <div className="flex items-center justify-center p-6 sm:p-10">

            <div className="w-full max-w-md">

              {/* Mobile Branding */}
              <div className="mb-8 text-center lg:hidden">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 shadow-lg">
                  <span className="text-xl font-black text-white">
                    B2
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-extrabold text-slate-900">
                  BOHECO II
                </h2>

                <p className="text-xs text-slate-500">
                  Bohol Electric Cooperative II
                </p>

              </div>

              {/* Heading */}
              <div className="mb-7">

                <p className="text-sm font-semibold text-amber-600">
                  Welcome back
                </p>

                <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                  Sign in to your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select your account type to continue.
                </p>

              </div>

              {/* Error */}
              {msg && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 mb-6 py-3 text-sm text-red-700"
                >
                  {msg}
                </div>
              )}

              {/* =================================================
                  EMPLOYEE / CONSUMER SWITCH
              ================================================= */}
              <div className="mb-7 rounded-xl bg-slate-100 p-1.5">

                <div className="grid grid-cols-2 gap-1">

                  {/* Employee */}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType("employee");
                      setMsg("");
                      setConsumerMsg("");
                    }}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                      loginType === "employee"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Employee
                  </button>

                  {/* Consumer */}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginType("consumer");
                      setMsg("");
                      setConsumerMsg("");
                    }}
                    className={`rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
                      loginType === "consumer"
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Consumer
                  </button>

                </div>
              </div>

              {/* =====================================================
                  EMPLOYEE LOGIN
              ===================================================== */}
              {loginType === "employee" && (
                <form
                  method="POST"
                  className="space-y-5"
                  onSubmit={handleSubmit}
                  aria-labelledby="login-heading"
                >

                  {/* Employee Information */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">

                    <p className="text-sm font-semibold text-amber-800">
                      Employee Portal
                    </p>

                    <p className="mt-0.5 text-xs text-amber-700">
                      For Authorized BOHECO II Employees Only.
                    </p>

                  </div>

                  {/* Email */}
                  <label className="block">

                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </span>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@boheco2.com.ph"
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      autoComplete="email"
                      autoFocus
                      aria-label="Email address"
                    />

                  </label>

                  {/* Password */}
                  <label className="block">

                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </span>

                    <div className="relative">

                      <input
                        type={show ? "password" : "text"}
                        name="password"
                        placeholder="Enter your password"
                        className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        {show ? <FaEyeSlash /> : <FaEye />}
                      </button>

                    </div>

                  </label>

                  {/* Login */}
                  <button
                    type="submit"
                    className={`w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 ${
                      loading
                        ? "cursor-not-allowed bg-amber-400"
                        : "bg-amber-600 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-xl"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">

                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                        Please wait...

                      </span>
                    ) : (
                      "Sign in as Employee"
                    )}
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center text-sm">

                    <Link
                      to="/forgot-password"
                      className="font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      Forgot your password?
                    </Link>

                  </div>

                </form>
              )}

              {/* =====================================================
                  CONSUMER LOGIN
              ===================================================== */}
              {loginType === "consumer" && (
                <div className="space-y-5">

                  {/* Consumer Information */}
                  <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
                    <p className="text-sm font-semibold text-sky-800">
                      Consumer Portal
                    </p>

                    <p className="mt-0.5 text-xs text-sky-700">
                      Sign in securely using your Google Account.
                    </p>
                  </div>

                  {/* Google Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={consumerLoading}
                    className={`flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold shadow-sm transition-all duration-200 ${
                      consumerLoading
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-300 bg-white text-slate-700 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    }`}
                  >
                    {consumerLoading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-amber-600" />
                        Connecting to Google...
                      </>
                    ) : (
                      <>
                        {/* Google Icon */}
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fill="#4285F4"
                            d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.4Z"
                          />

                          <path
                            fill="#34A853"
                            d="M12 21.6c2.63 0 4.84-.87 6.45-2.37l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.52A9.75 9.75 0 0 0 12 21.6Z"
                          />

                          <path
                            fill="#FBBC05"
                            d="M6.54 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.15.31-1.68V7.8H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.2l3.24-2.52Z"
                          />

                          <path
                            fill="#EA4335"
                            d="M12 6.29c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.83 3.38 14.63 2.4 12 2.4a9.75 9.75 0 0 0-8.7 5.4l3.24 2.52C7.31 8.01 9.46 6.29 12 6.29Z"
                          />
                        </svg>

                        Continue with Google
                      </>
                    )}
                  </button>

                  {/* Error */}
                  {consumerMsg && (
                    <div
                      role="alert"
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {consumerMsg}
                    </div>
                  )}
                </div>
              )}

              {/* =====================================================
                  SECURITY NOTICE
              ===================================================== */}
              <div className="mt-8 border-t border-slate-200 pt-5">

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your account information is protected. Please do not
                  share your login credentials with anyone.
                </p>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;