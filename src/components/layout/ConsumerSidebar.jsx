import {
  FaBook,
  FaCog,
  FaPowerOff,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabase";
import ConfirmModal from "../ConfirmModal";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // =========================================
  // SIDEBAR ITEMS
  // =========================================
  const items = [
    {
      label: "Dashboard",
      icon: FaBook,
      path: "/consumer-dashboard",
    },
    {
      label: "Settings",
      icon: FaCog,
      path: "/consumer-settings",
    },
  ];

  return (
    <aside
      className={`fixed top-[76px] left-0 z-40 h-[calc(100vh-76px)]
        bg-[#faf9f8]
        border-r border-amber-200/70
        shadow-sm
        transition-all duration-300
        ${collapsed ? "w-[75px]" : "w-[220px]"}`}
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
        {items.map((item) => {
          const Icon = item.icon;

          // Check current route
          const isActive = location.pathname === item.path;

          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ""}
                className={`
                  group
                  flex
                  h-[52px]
                  w-full
                  items-center
                  rounded-xl
                  px-3
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-amber-100"
                      : "hover:bg-amber-100"
                  }
                `}
              >
                {/* =================================================
                    ICON
                ================================================== */}
                <span
                  className={`
                    flex
                    h-8
                    w-8
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    shadow-sm
                    transition
                    ${
                      isActive
                        ? "bg-amber-200 text-amber-800"
                        : "bg-white text-amber-700 group-hover:bg-amber-200 group-hover:text-amber-800"
                    }
                  `}
                >
                  <Icon className="text-sm" />
                </span>

                {/* =================================================
                    LABEL
                ================================================== */}
                {!collapsed && (
                  <span
                    className={`
                      ml-3
                      whitespace-nowrap
                      text-[13px]
                      font-medium
                      transition
                      ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-700 group-hover:text-slate-900"
                      }
                    `}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
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