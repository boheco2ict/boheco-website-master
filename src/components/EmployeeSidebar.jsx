import {
  FaTachometerAlt,
  FaFolderOpen,
  FaFileAlt,
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
  const { employeeInfo, loading } = useAuth();
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

  // =========================================
  // GET DASHBOARD LINK BASED ON ROLE
  // =========================================
  const getDashboardLink = () => {
    let role = employeeInfo?.role;

    switch (role) {
      case "EDITOR":
        return "/editor-dashboard";
      case "CONSUMER":
        return "/consumer-dashboard";
      case "ADMIN":
        return "/admin-dashboard";
      case "USER":
      case "HR":
        return "/dashboard";
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  const items = [
    ["Dashboard", FaTachometerAlt, dashboardLink],
    ["Coop Policies", FaFolderOpen, "/coop-policies"],
    ["Employee Manual", FaFileAlt, "/employee-manuals"],
    ["Settings", FaCog, "/settings"],
  ];

  return (
    <aside
      className={`fixed top-[76px] left-0 z-40 h-[calc(100vh-76px)]
        bg-[#faf9f8]
        border-r border-[#E7DFD0]
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

      {/* Collapse Button */}
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
          border-[#E7DFD0]
          bg-[#FFFBEB]
          text-slate-600
          shadow-md
          transition
          hover:bg-white
          hover:text-amber-700
        "
      >
        {collapsed ? (
          <FaChevronRight className="text-xs" />
        ) : (
          <FaChevronLeft className="text-xs" />
        )}
      </button>

      {/* Navigation */}
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
                  transition-all
                  duration-200
                  hover:bg-[#FFF1BD]
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
                    bg-[#FFF8E1]
                    text-[#B45309]
                    transition
                    group-hover:bg-white
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
                      text-[#44403C]
                      transition
                      group-hover:text-[#78350F]
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
                    bg-slate-100
                    text-slate-400
                  "
                >
                  <Icon className="text-sm" />
                </span>

                {!collapsed && (
                  <span className="ml-3 text-[13px] font-medium text-slate-400">
                    {label}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 w-full border-t border-[#E7DFD0] p-2">
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
              text-red-600
              transition
              group-hover:bg-red-100
            "
          >
            <FaPowerOff className="text-sm" />
          </span>

          {!collapsed && (
            <span className="ml-3 text-[13px] font-medium">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;