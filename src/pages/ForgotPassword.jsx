import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validRegEx = /^[^\\&']*$/;
    if (!email.match(validRegEx)) {
      setMsg("Unauthorized");
      return;
    }

    const redirectUrl = process.env.REACT_APP_URL;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password reset email sent!");
    }
    setLoading(false);
  };
  return (
    <>
      <div className="bg-image2 h-screen flex justify-center items-center">
        <form
          method="POST"
          className="p-5 bg-gray-900 shadow-lg rounded-lg shadow-slate-500 flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="text-white font-bold text-center">
            Forgot Password
          </div>
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
                Submit
              </button>
            </div>
          )}
          <Link
            to="/login"
            className="group inline-flex items-center text-blue-400"
          >
            <span className="relative inline-block">
              ← Go Back!
              <span className="absolute right-0 bottom-0 h-[2px] w-full scale-x-0 origin-right bg-blue-400 transition-transform duration-300 group-hover:scale-x-100"></span>
            </span>
          </Link>
        </form>
      </div>
    </>
  );
}

export default ForgotPassword;
