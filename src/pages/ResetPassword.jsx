import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

function ResetPassword() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(true);
  const [confirmShow, setConfrimShow] = useState(true);

  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRecovery = async () => {
      const { data } = await supabase.auth.getSession();

      // No Recovery sesssion/token
      if (!data.session) {
        navigate("/login");
        return;
      }
    };

    setAllowed(true);
    setLoading(false);

    checkRecovery();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!allowed) {
    return null;
  }

  const handleReset = async (e) => {
    e.preventDefault();

    if (pwd !== confirm) {
      setMsg("Password do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pwd });

    if (error) {
      setMsg(error.message);
      return;
    }

    alert("Password updated successfully");
    navigate("/login");
  };
  return (
    <>
      <div className="bg-image2 h-screen flex justify-center items-center">
        <form
          method="POST"
          className="p-5 bg-gray-900 shadow-lg rounded-lg shadow-slate-500 flex flex-col gap-2"
          onSubmit={handleReset}
        >
          <div className="text-white font-bold text-center">Reset Password</div>
          <span className="w-full text-red-400 text-center font-semibold">
            FOR BOHECO II EMPLOYEE ONLY
          </span>
          <div className="w-full bg-gray-800 p-2 rounded-xl flex justify-between items-center">
            <input
              type={show ? "password" : "text"}
              placeholder="New Password"
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
          <div className="w-full bg-gray-800 p-2 rounded-xl flex justify-between items-center">
            <input
              type={confirmShow ? "password" : "text"}
              placeholder="Confirm Password"
              className="bg-transparent border-0 w-full outline-none text-white"
              onChange={(e) => setConfirm(e.target.value)}
              value={confirm}
            />
            {confirmShow ? (
              <FaEyeSlash
                className="text-white"
                onClick={() => setConfrimShow(!confirmShow)}
              />
            ) : (
              <FaEye
                className="text-white"
                onClick={() => setConfrimShow(!confirmShow)}
              />
            )}
          </div>
          {msg && <span className="text-red-500">{msg}</span>}
          <button type="submit" className="bg-green-500 p-2 rounded-md w-full">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ResetPassword;
