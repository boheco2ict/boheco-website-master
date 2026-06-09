import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaFileInvoiceDollar, FaFolderOpen, FaPowerOff, FaBars, FaTimes, FaSignOutAlt, FaHome, FaInfoCircle, FaChartLine, FaBell, FaFileAlt, FaHeartbeat, FaHandshake, FaTrophy, FaSignInAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import ConfirmModal from "./ConfirmModal";

const img = ["/assets/logo.png"];

const Navigation = () => {
  const { user } = useAuth();
  const auth = !!user;
  const Links = [
    { id: 1, name: "HOME", link: "/" },
    { id: 2, name: "ABOUT", link: "about" },
    { id: 3, name: "RATE ADVISORY", link: "rate-advisory" },
    { id: 4, name: "NOTICE", link: "notice" },
    { id: 11, name: "COOP POLICIES", link: "coop-policies" },
    { id: 5, name: "DDP & PSPPs", link: "ddpandpspp" },
    { id: 6, name: "LIFELINE RATE", link: "lifeline" },
    { id: 7, name: "PAYMENT PARTNERS", link: "partners" },
    { id: 8, name: "BILL INQUIRIES", link: "inquiries" },
    { id: 9, name: "AWARDS", link: "awards" },
  ];

  const AuthLink = [
    { id: 10, name: "DASHBOARD", link: "dashboard" },
    { id: 12, name: "LOGOUT", type: "action", action: "logout" },
  ];

  const GuestLink = [{ id: 13, name: "LOGIN", link: "login" }];

  const desktopGuestLinks = [
    ...Links.filter((link) => link.link !== "/" && link.link !== "coop-policies"),
    ...GuestLink,
  ];

  const location = useLocation();

  const isDashboardPath = location.pathname.startsWith("/dashboard");
  const visibleLinks = auth
    ? Links.filter((link) => link.link !== "/")
    : isDashboardPath
    ? Links.filter((link) => link.link !== "/")
    : Links.filter((link) => link.link !== "coop-policies");
  const menuLink = auth ? [...visibleLinks, ...AuthLink] : [...visibleLinks, ...GuestLink];
  let sidebarLinks;
  if (auth) {
    const byLink = (key) => menuLink.find((l) => l.link === key);

    const dash = byLink("dashboard");
    const inquiries = byLink("inquiries");
    const coopPolicies = byLink("coop-policies");
    const logout = menuLink.find((l) => l.type === "action" && l.action === "logout") || menuLink.find((l) => l.name === "LOGOUT");

    sidebarLinks = [dash, inquiries, coopPolicies, logout].filter(Boolean);
  } else {
    sidebarLinks = menuLink.filter(
      (link) =>
        link.link !== "about" &&
        link.link !== "rate-advisory" &&
        link.link !== "notice" &&
        link.link !== "ddpandpspp" &&
        link.link !== "lifeline" &&
        link.link !== "partners" &&
        link.link !== "awards"
    );

  }


  const mobileMenuLinks = auth ? sidebarLinks : menuLink;

  
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [winWidth, setWinWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    if (typeof window !== "undefined") window.addEventListener("resize", onResize);
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", onResize);
    };
  }, []);

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
    <>
      {/* Sidebar for logged-in desktop users: collapsed by default, expands on hover */}
      {auth && (
        <aside
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
          className="hidden xl:flex fixed left-0 top-0 z-50 overflow-hidden transition-all duration-300 app-sidebar"
          style={{ width: sidebarExpanded ? Math.min(Math.max(winWidth * 0.14, 220), 240) : 56, bottom: 0, borderRightColor: 'transparent' }}
        >
          <nav className="flex h-full w-full flex-col">
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-3 py-5 border-b border-slate-200">
              <img 
                src={img[0]} 
                alt="BOHECO II logo" 
                className="flex-none rounded-lg bg-transparent shadow-sm transition-all duration-300" 
                style={{ 
                  width: sidebarExpanded ? 44 : 32, 
                  height: sidebarExpanded ? 44 : 32 
                }} 
              />
              <div className={`leading-tight overflow-hidden transition-all duration-300 ${sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                <p className="text-sm font-extrabold tracking-wide theme-text-primary whitespace-nowrap">BOHECO II</p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider theme-muted whitespace-nowrap">Services</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
              {(() => {
                const logoutItem = sidebarLinks.find((l) => (l.type === "action" && l.action === "logout") || l.name === "LOGOUT");
                const nonLogout = sidebarLinks.filter((l) => l !== logoutItem);

                return (
                  <>
                    {nonLogout.map((link) => {
                      const getIcon = (lnk) => {
                        if (lnk.link === "dashboard") return FaTachometerAlt;
                        if (lnk.link === "inquiries") return FaFileInvoiceDollar;
                        if (lnk.link === "coop-policies") return FaFolderOpen;
                        return null;
                      };

                      const Icon = getIcon(link);
                      const isCOOPActive = link.link === "coop-policies" && location.pathname === "/coop-policies";

                      return (
                        <div key={link.id} className="flex items-center justify-between gap-2">
                          <NavLink
                            to={link.link === "/" ? "/" : link.link === "coop-policies" ? "/coop-policies" : `/${link.link}`}
                            end={link.link === "/" || link.link === "dashboard" || link.link === "coop-policies"}
                            className={({ isActive }) => {
                              const shouldHighlight = link.link === "coop-policies" ? isCOOPActive : isActive;
                              return `group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                shouldHighlight 
                                  ? "bg-amber-100 text-amber-900 shadow-sm" 
                                  : "text-slate-600 hover:bg-slate-50"
                              }`;
                            }}
                            title={!sidebarExpanded ? link.name : ""}
                          >
                            <span 
                              className="flex items-center justify-center rounded-md bg-slate-100 transition-all duration-200 group-hover:bg-slate-200"
                              style={{
                                width: 32,
                                height: 32,
                                color: "#b45309"
                              }}
                            >
                              {Icon ? <Icon className="h-4 w-4 block" /> : link.name.charAt(0)}
                            </span>
                            <span 
                              className={`truncate text-sm font-medium transition-all duration-300 ${
                                sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                              }`}
                            >
                              {link.name}
                            </span>
                            
                            {/* Tooltip for collapsed state */}
                            {!sidebarExpanded && (
                              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                {link.name}
                              </div>
                            )}
                          </NavLink>

                        </div>
                      );
                    })}
                  </>
                );
              })()}
            </div>

            {/* Logout Button */}
            {(() => {
              const logoutItem = sidebarLinks.find((l) => (l.type === "action" && l.action === "logout") || l.name === "LOGOUT");
              return logoutItem ? (
                <div className="border-t border-slate-200 px-2 py-4">
                  <button
                    type="button"
                    onClick={handleLogoutRequest}
                    className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50"
                    title={!sidebarExpanded ? logoutItem.name : ""}
                  >
                    <span 
                      className="flex items-center justify-center rounded-md bg-red-50 transition-all duration-200 group-hover:bg-red-100"
                      style={{
                        width: 32,
                        height: 32,
                        color: "#dc2626"
                      }}
                    >
                      <FaPowerOff className="h-4 w-4 block" />
                    </span>
                    <span 
                      className={`truncate text-sm font-medium transition-all duration-300 ${
                        sidebarExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                      }`}
                    >
                      {logoutItem.name}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {!sidebarExpanded && (
                      <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        {logoutItem.name}
                      </div>
                    )}
                  </button>
                </div>
              ) : null;
            })()}
          </nav>
        </aside>
      )}

      {/* Header for landing page and mobile menu */}
      <header className={`fixed left-0 top-0 z-50 w-full shadow-none xl:shadow-md backdrop-blur-sm app-header ${auth ? 'xl:hidden' : ''}`} style={{borderBottomColor: 'transparent', background: 'var(--mobile-header-bg)', borderBottomWidth: '1px', borderBottomStyle: 'solid', boxShadow: 'none'}}>
        <div className="mx-auto flex min-h-[64px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {auth ? (
            <div className="flex min-w-0 items-center gap-3 rounded-md py-1 pr-2" aria-label="BOHECO II home" style={{color: 'var(--text-primary)'}}>
              <img src={img[0]} alt="BOHECO II logo" className="h-10 w-10 flex-none bg-transparent shadow-sm rounded-md" />
              <div className="border-l-4 border-amber-400 pl-3 leading-tight">
                <p className="text-base font-extrabold tracking-wide">BOHECO II</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest" style={{color:'var(--muted)'}}>Services</p>
              </div>
            </div>
          ) : (
            <NavLink to="/" className="group flex min-w-0 items-center gap-3 rounded-lg py-1 pr-2 transition-all hover:bg-amber-50/70" aria-label="BOHECO II home" style={{color:'var(--text-primary)'}}>
              <img src={img[0]} alt="BOHECO II logo" className="h-10 w-10 flex-none bg-transparent shadow-sm rounded-md" />
              <div className="border-l-4 border-amber-400 pl-3 leading-tight">
                <p className="text-base font-extrabold tracking-wide group-hover:text-amber-800 transition-colors">BOHECO II</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest" style={{color:'var(--muted)'}}>Services</p>
              </div>
            </NavLink>
          )}

          {!auth && (
            <div className="hidden items-center gap-2 xl:flex xl:overflow-x-auto">
              {desktopGuestLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.link === "/" ? "/" : `/${link.link}`}
                  end={link.link === "/"}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-semibold transition-all ${isActive ? 'bg-amber-100 text-amber-900 shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`
                  }
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}

          <div className={`flex items-center gap-2 ${auth ? '' : 'xl:hidden'}`}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              style={{ color: 'var(--text-primary)' }}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        <nav
          className={`${open ? 'translate-y-0 opacity-100 mobile-nav-slide' : 'pointer-events-none -translate-y-2 opacity-0 hidden'} absolute left-0 top-full w-full px-4 py-3 shadow-lg transition-all duration-300 max-h-[calc(100vh-64px)] overflow-y-auto`}
          aria-label="Primary navigation"
          style={{ background: 'var(--mobile-header-bg)', borderBottomColor: 'var(--muted)' }}
        >
          <ul className="flex flex-col gap-1.5">
            {mobileMenuLinks.map((link) => {
              const isAction = link.type === "action" || !link.link;

              if (isAction) {
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={handleLogoutRequest}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-red-600 transition-all hover:bg-red-50"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-md bg-red-50">
                        <FaSignOutAlt className="h-4 w-4 block" />
                      </span>
                      {link.name}
                    </button>
                  </li>
                );
              }

              if (!link.link) return null;

              return (
                <li key={link.id} className="flex items-center justify-between gap-2">
                  <NavLink
                    to={link.link === "/" ? "/" : link.link === "coop-policies" ? "/coop-policies" : `/${link.link}`}
                    end={link.link === "/" || link.link === "dashboard" || link.link === "coop-policies"}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all ${isActive ? 'bg-amber-100 text-amber-900 shadow-sm' : 'hover:bg-slate-100'}`
                    }
                    style={({ isActive }) => ({ color: isActive ? 'var(--text-primary)' : 'var(--muted)' })}
                  >
                    {({ isActive }) => {
                      const getLinkIcon = (path) => {
                        switch (path) {
                          case "/":
                            return FaHome;
                          case "about":
                            return FaInfoCircle;
                          case "rate-advisory":
                            return FaChartLine;
                          case "notice":
                            return FaBell;
                          case "ddpandpspp":
                            return FaFileAlt;
                          case "lifeline":
                            return FaHeartbeat;
                          case "partners":
                            return FaHandshake;
                          case "inquiries":
                            return FaFileInvoiceDollar;
                          case "awards":
                            return FaTrophy;
                          case "dashboard":
                            return FaTachometerAlt;
                          case "coop-policies":
                            return FaFolderOpen;
                          case "login":
                            return FaSignInAlt;
                          default:
                            return null;
                        }
                      };

                      const Icon = getLinkIcon(link.link);
                      return (
                        <>
                          <span className={`flex items-center justify-center w-10 h-10 flex-none rounded-md transition-all ${isActive ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'}`}>
                            {Icon ? <Icon className="h-5 w-5 block" /> : link.name.charAt(0)}
                          </span>
                          <span className="truncate">{link.name}</span>
                        </>
                      );
                    }}
                  </NavLink>
                </li>
              );
            })}

          </ul>
        </nav>
      </header>

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
    </>
  );
};

export default Navigation;  