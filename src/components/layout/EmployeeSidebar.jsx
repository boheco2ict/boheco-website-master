import {
  FaTachometerAlt,
  FaFolderOpen,
  FaFileAlt,
  FaCog,
  FaPowerOff,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaEdit,
  FaUserShield,
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../supabase";
import ConfirmModal from "../ConfirmModal";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { employeeInfo, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Dropdown states
  const [editorOpen, setEditorOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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
  // GET USER ROLE
  // =========================================
  const role = employeeInfo?.role;

  // =========================================
  // SIDEBAR ITEMS
  // =========================================
  const items = [
    {
      label: "Dashboard",
      icon: FaTachometerAlt,
      path: "/dashboard",
      roles: ["USER", "HR", "EDITOR", "ADMIN"],
    },

    {
      label: "Coop Policies",
      icon: FaFolderOpen,
      path: "/coop-policies",
      roles: ["USER", "HR", "EDITOR", "ADMIN"],
    },

    {
      label: "Employee Manual",
      icon: FaFileAlt,
      path: "/employee-manuals",
      roles: ["USER", "HR", "EDITOR", "ADMIN"],
    },

    // =========================================
    // EDITOR DROPDOWN
    // =========================================
    {
      label: "Editor",
      icon: FaEdit,
      dropdown: "editor",
      roles: ["EDITOR"],
      children: [
        {
          label: "Power Rates",
          path: "/editor-power-rates",
        },
        {
          label: "Rate Advisory",
          path: "/editor-rate-advisory",
        },
        {
          label: "Generation Charge",
          path: "/editor-generation-charge",
        },
      ],
    },

    // =========================================
    // ADMIN DROPDOWN
    // =========================================
    {
      label: "Admin",
      icon: FaUserShield,
      dropdown: "admin",
      roles: ["ADMIN"],
      children: [
        {
          label: "Manage Employee",
          path: "/admin-manage-employee",
        },
        {
          label: "Leave Approver",
          path: "/admin-leave-approver",
        },
      ],
    },

    // =========================================
    // SETTINGS
    // =========================================
    {
      label: "Settings",
      icon: FaCog,
      path: "/settings",
      roles: ["USER", "HR", "EDITOR", "ADMIN"],
    },
  ];

  // =========================================
  // FILTER ITEMS BASED ON ROLE
  // =========================================
  const visibleItems = items.filter((item) =>
    item.roles.includes(role)
  );

  // =========================================
  // CHECK IF DROPDOWN CHILD IS ACTIVE
  // =========================================
  const isDropdownActive = (item) => {
    if (!item.children) return false;

    return item.children.some(
      (child) => location.pathname === child.path
    );
  };

  // =========================================
  // HANDLE DROPDOWN
  // =========================================
  const handleDropdownToggle = (dropdown) => {
    if (collapsed) {
      setCollapsed(false);

      if (dropdown === "editor") {
        setEditorOpen(true);
      }

      if (dropdown === "admin") {
        setAdminOpen(true);
      }

      return;
    }

    if (dropdown === "editor") {
      setEditorOpen((prev) => !prev);
    }

    if (dropdown === "admin") {
      setAdminOpen((prev) => !prev);
    }
  };

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

      {/* =========================================
          COLLAPSE BUTTON
      ========================================= */}
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

      {/* =========================================
          NAVIGATION
      ========================================= */}
      <nav className="space-y-2 p-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;

          // =========================================
          // DROPDOWN ITEM
          // =========================================
          if (item.children) {
            const isActive = isDropdownActive(item);

            const isOpen =
              item.dropdown === "editor"
                ? editorOpen
                : adminOpen;

            return (
              <div key={item.label}>
                {/* Dropdown Header */}
                <button
                  type="button"
                  onClick={() =>
                    handleDropdownToggle(item.dropdown)
                  }
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
                        ? "bg-[#FFF1BD]"
                        : "hover:bg-[#FFF1BD]"
                    }
                  `}
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
                    <>
                      <span
                        className="
                          ml-3
                          flex-1
                          text-left
                          whitespace-nowrap
                          text-[13px]
                          font-medium
                          text-[#44403C]
                          transition
                          group-hover:text-[#78350F]
                        "
                      >
                        {item.label}
                      </span>

                      <FaChevronDown
                        className={`
                          text-[10px]
                          text-[#78716C]
                          transition-transform
                          duration-200
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </>
                  )}
                </button>

                {/* =========================================
                    DROPDOWN CHILDREN
                ========================================= */}
                {!collapsed && isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-[#E7DFD0] pl-3">
                    {item.children.map((child) => {
                      const childActive =
                        location.pathname === child.path;

                      return (
                        <button
                          key={child.label}
                          type="button"
                          onClick={() => navigate(child.path)}
                          className={`
                            flex
                            w-full
                            items-center
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-[12px]
                            transition
                            ${
                              childActive
                                ? "bg-[#FFF1BD] font-semibold text-[#78350F]"
                                : "text-[#57534E] hover:bg-[#FFF8E1] hover:text-[#78350F]"
                            }
                          `}
                        >
                          <span
                            className={`
                              mr-2
                              h-1.5
                              w-1.5
                              rounded-full
                              ${
                                childActive
                                  ? "bg-[#B45309]"
                                  : "bg-[#D6D3D1]"
                              }
                            `}
                          />

                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // =========================================
          // NORMAL SIDEBAR ITEM
          // =========================================
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
                      ? "bg-[#FFF1BD]"
                      : "hover:bg-[#FFF1BD]"
                  }
                `}
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
                    {item.label}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* =========================================
          LOGOUT
      ========================================= */}
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