import { useState, useEffect } from "react";
import { FaCog, FaLock, FaChevronRight, FaTimes, FaUserEdit } from "react-icons/fa";
import ResetPassword from "./ResetPassword";
import { useAuth } from "../../context/AuthContext";
import UpdateForm from "../../pages/consumer/update_info_form";

const Settings = () => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { user, employeeInfo, consumerInfo, loading } = useAuth();
  const [showConsumerForm, setShowConsumerForm] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user && employeeInfo) {
      setRole(employeeInfo?.role || "");
    }

    if (user && consumerInfo) {
      setRole(consumerInfo?.role || "")
    }
  }, [consumerInfo, employeeInfo, user]);

  if (loading) {
    return;
  }

  return (
    <div
      className="w-full px-5 pt-[21px] min-h-screen"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="space-y-6">

        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <FaCog className="text-lg" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your account and security preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-900">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update and manage your account information and security.
            </p>
          </div>

          {/* Settings Items */}
          <div className="p-3">

            {/* Reset Password */}
            {role !== "CONSUMER" && (
              <button
                type="button"
                onClick={() => setShowResetPassword(true)}
                className="group w-full flex items-center gap-4 rounded-xl px-4 py-4 text-left transition hover:bg-amber-50"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-200">
                  <FaLock className="text-base" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Reset Password
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Change your current password to keep your account secure.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition group-hover:bg-white group-hover:text-amber-700">
                  <FaChevronRight className="text-xs" />
                </div>
              </button>
            )}
            {role === "CONSUMER" && (
              <button
                type="button"
                onClick={() => setShowConsumerForm(true)}
                className="group w-full flex items-center gap-4 rounded-xl px-4 py-4 text-left transition hover:bg-amber-50"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition group-hover:bg-amber-200">
                  <FaUserEdit className="text-base" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Change Account Information
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Update your account information to keep your account details accurate.
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition group-hover:bg-white group-hover:text-amber-700">
                  <FaChevronRight className="text-xs" />
                </div>
              </button>
            )}
          </div>
        </section>

        {/* Security Notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex gap-3">
            <div className="mt-0.5 text-amber-700">
              <FaLock className="text-sm" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                Keep your account secure
              </h3>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                Use a strong password and avoid sharing your account
                credentials with anyone.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================
                         MODAL
      ========================================== */}
      {showResetPassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowResetPassword(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <FaTimes className="text-sm" />
            </button>
            <ResetPassword modal />
          </div>
        </div>
      )}

      <UpdateForm
        isOpen={showConsumerForm}
        onClose={() => setShowConsumerForm(false)}
        onSuccess={() => {
          setShowConsumerForm(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Settings;