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
    setLoading(true);
    const validRegEx = /^[^\\&']*$/;
    if (!email.match(validRegEx)) {
      setMsg("Unauthorized");
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
    <>
      <div className="bg-image2 h-screen flex justify-center items-center">
        <form
          method="POST"
          className="p-5 bg-gray-900 shadow-lg rounded-lg shadow-slate-500 flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="text-white font-bold text-center">Login</div>
          <span className="w-full text-red-400 text-center font-semibold">
            FOR BOHECO II EMPLOYEE ONLY
          </span>
          <div className="w-full bg-gray-800 p-2 rounded-xl">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-transparent border-0 w-full outline-none text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="w-full bg-gray-800 p-2 rounded-xl flex justify-between items-center">
            <input
              type={show ? "password" : "text"}
              name="password"
              placeholder="Password"
              className="bg-transparent border-0 w-full outline-none text-white"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
            />
            {show ? (
              <FaEyeSlash
                className="text-white"
                onClick={() => setShow(!show)}
              />
            ) : (
              <FaEye className="text-white" onClick={() => setShow(!show)} />
            )}
          </div>
          {msg && <span className="text-red-500">{msg}</span>}
          {loading ? (
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-gray-500 p-2 rounded-md w-full"
                disabled={true}
              >
                Please wait...
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 p-2 rounded-md w-full hover:bg-green-600 transition duration-300"
              >
                Login
              </button>
            </div>
          )}
          <Link
            to="/forgot-password"
            className="group inline-flex items-center text-blue-400"
          >
            <span className="relative inline-block">
              Forgot Password? →
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
