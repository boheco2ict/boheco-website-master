import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { FaTimes, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import ConfirmModal from "./ConfirmModal";

const img = ["assets/l.png"];

const Navigation = () => {
  const { user } = useAuth();
  const auth = !!user;
  const Links = [
    { id: 1, name: "HOME", link: "/" },
    { id: 2, name: "ABOUT", link: "about" },
    { id: 3, name: "RATE ADVISORY", link: "rate-advisory" },
    { id: 4, name: "NOTICE", link: "notice" },
    { id: 5, name: "DDP & PSPPs", link: "ddpandpspp" },
    { id: 6, name: "LIFELINE RATE", link: "lifeline" },
    { id: 7, name: "PAYMENT PARTNERS", link: "partners" },
    { id: 8, name: "BILL INQUIRIES", link: "inquiries" },
    { id: 9, name: "AWARDS", link: "awards" },
  ];

  const AuthLink = [
    { id: 10, name: "DASHBOARD", link: "dashboard" },
    { id: 11, name: "COOP POLICIES", link: "coop-policies" },
    { id: 12, name: "LOGOUT", type: "action", action: "logout" },
  ];

  const GuestLink = [{ id: 13, name: "LOGIN", link: "login" }];

  const menuLink = auth ? [...Links, ...AuthLink] : [...Links, ...GuestLink];

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const navigate = useNavigate();

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

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          className="group flex min-w-0 items-center gap-3 rounded-md py-1 pr-2 text-slate-900 transition hover:bg-amber-50/70"
          aria-label="BOHECO II home"
        >
          <img
            src={img[0]}
            alt="BOHECO II logo"
            className="h-12 w-12 flex-none rounded-full border border-amber-200 bg-white p-1 shadow-sm"
          />
          <div className="hidden border-l-4 border-amber-400 pl-3 leading-tight sm:block">
            <p className="text-xl font-extrabold tracking-wide text-slate-950 group-hover:text-amber-800">
              BOHECO II
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Employee Services
            </p>
          </div>
        </NavLink>

        <nav
          className={`absolute left-0 top-full w-full border-b border-slate-200 bg-white px-4 py-3 shadow-lg transition-all duration-300 xl:static xl:w-auto xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none ${
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0 xl:pointer-events-auto xl:translate-y-0 xl:opacity-100"
          }`}
          aria-label="Primary navigation"
        >
          <ul className="flex max-h-[calc(100vh-76px)] flex-col gap-1 overflow-y-auto xl:max-h-none xl:flex-row xl:items-center xl:gap-1 xl:overflow-visible">
            {menuLink.map((link) => {
              const isAction = link.type === "action" || !link.link;

              if (isAction) {
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={handleLogoutRequest}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50 xl:w-auto xl:py-2"
                    >
                      <FaSignOutAlt />
                      {link.name}
                    </button>
                  </li>
                );
              }

              if (!link.link) return null;

              return (
                <li key={link.id}>
                  <NavLink
                    to={link.link}
                    end={link.link === "/"}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-3 text-sm font-semibold transition xl:py-2 ${
                        isActive
                          ? "bg-amber-100 text-slate-950"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden rounded-md p-2 text-blue-600 transition hover:bg-blue-50 sm:inline-flex"
            href="https://www.facebook.com/boheco2"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit BOHECO II on Facebook"
          >
            <BsFacebook size={24} />
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Are you sure you want to logout?"
        text="You will be signed out of your account."
        icon="warning"
        confirmText="Yes, logout"
        cancelText="Cancel"
        loading={isLoggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </header>
  );
};

export default Navigation;
