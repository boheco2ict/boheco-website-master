import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validRegEx = /^[^\\&']*$/;
    if (!user.match(validRegEx)) {
      setMsg("Unauthorized");
      return;
    }

    try {
      const response = await axios.post(
        "https://bill-inquiry-api.onrender.com/api/v1/login",
        { user, pwd },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.auth) {
        localStorage.setItem("token", response.data.token);
        window.location.replace("/");
      } else {
        setMsg("Unauthorized");
        setLoading(false);
      }
    } catch (error) {
      // console.error(error);
      if (error.message === "Network Error") {
        setMsg("Network Error");
        setLoading(false);
      } else {
        setMsg(error?.response?.data || "Login failed");
        setLoading(false);
      }
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
              type="text"
              name="username"
              placeholder="Username"
              className="bg-transparent border-0 w-full outline-none text-white"
              onChange={(e) => setUser(e.target.value)}
              value={user}
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
                className="bg-green-500 p-2 rounded-md w-full"
              >
                Login
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default Login;
