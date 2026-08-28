import {
  FaBook,
  FaCog,
  FaPowerOff,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import ConfirmModal from "./ConfirmModal";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutRequest = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore errors
    }

    setIsLoggingOut(false);
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  const handleCancelLogout = () => setShowLogoutConfirm(false);

  // =========================================
  // PAUSE SIDEBAR WHILE AUTH IS LOADING
  // =========================================
  if (loading) {
    return null;
  }

  const items = [
    ["Ledger", FaBook, "/consumer-dashboard"],
    ["Settings", FaCog, "/consumer-settings"],
  ];

  return (
    <aside
      className={`fixed top-[76px] left-0 z-40 h-[calc(100vh-76px)]
        bg-[#faf9f8]
        border-r border-amber-200/70
        shadow-sm
        transition-all duration-300
        ${
          collapsed ? "w-[75px]" : "w-[220px]"
        }`}
    >
      <ConfirmModal
        open={showLogoutConfirm}
        title="Are you sure you want to logout?"
        text="You will be signed out of your account."
        icon="warning"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        loading={isLoggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />

      {/* =====================================================
          COLLAPSE BUTTON
      ====================================================== */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="
          absolute
          -right-[14px]
          top-[20px]
          z-[60]
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          border-amber-200
          bg-white
          text-slate-600
          shadow-md
          transition
          hover:bg-amber-50
          hover:text-amber-700
        "
      >
        {collapsed ? (
          <FaChevronRight className="text-xs" />
        ) : (
          <FaChevronLeft className="text-xs" />
        )}
      </button>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}
      <nav className="space-y-2 p-2">
        {items.map(([label, Icon, path]) => (
          <div key={label}>
            {path ? (
              <a
                href={path}
                title={collapsed ? label : ""}
                className="
                  group
                  flex
                  h-[52px]
                  items-center
                  rounded-xl
                  px-3
                  transition
                  hover:bg-amber-100
                "
              >
                {/* Icon */}
                <span
                  className="
                    flex
                    h-8
                    w-8
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-amber-700
                    shadow-sm
                    transition
                    group-hover:bg-amber-200
                    group-hover:text-amber-800
                  "
                >
                  <Icon className="text-sm" />
                </span>

                {/* Label */}
                {!collapsed && (
                  <span
                    className="
                      ml-3
                      whitespace-nowrap
                      text-[13px]
                      font-medium
                      text-slate-700
                      transition
                      group-hover:text-slate-900
                    "
                  >
                    {label}
                  </span>
                )}
              </a>
            ) : (
              <div
                title={collapsed ? label : ""}
                className="
                  flex
                  h-[52px]
                  items-center
                  rounded-xl
                  px-3
                  opacity-50
                  cursor-not-allowed
                "
              >
                <span
                  className="
                    flex
                    h-8
                    w-8
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-white
                    text-slate-400
                    shadow-sm
                  "
                >
                  <Icon className="text-sm" />
                </span>

                {!collapsed && (
                  <span
                    className="
                      ml-3
                      text-[13px]
                      font-medium
                      text-slate-400
                    "
                  >
                    {label}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* =====================================================
          LOGOUT
      ====================================================== */}
      <div
        className="
          absolute
          bottom-0
          w-full
          border-t
          border-amber-200/70
          p-2
        "
      >
        <button
          type="button"
          onClick={handleLogoutRequest}
          title={collapsed ? "Logout" : ""}
          className="
            group
            flex
            h-[52px]
            w-full
            items-center
            rounded-xl
            px-3
            text-red-600
            transition
            hover:bg-red-50
          "
        >
          {/* Logout Icon */}
          <span
            className="
              flex
              h-8
              w-8
              flex-shrink-0
              items-center
              justify-center
              rounded-lg
              bg-red-50
              text-red-500
              transition
              group-hover:bg-red-100
              group-hover:text-red-600
            "
          >
            <FaPowerOff className="text-sm" />
          </span>

          {/* Logout Text */}
          {!collapsed && (
            <span
              className="
                ml-3
                text-[13px]
                font-medium
                text-red-600
              "
            >
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;