import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const [open, setOpen] = useState(false);
    const img = ["/assets/l.png"];

    const Links = [
        { id: 1, name: "ABOUT", link: "about" },
        { id: 2, name: "RATE ADVISORY", link: "rate-advisory" },
        { id: 3, name: "NOTICE", link: "notice" },
        { id: 4, name: "DDP & PSPPs", link: "ddpandpspp" },
        { id: 5, name: "LIFELINE RATE", link: "lifeline" },
        { id: 6, name: "PAYMENT PARTNERS", link: "partners" },
        { id: 7, name: "BILL INQUIRIES", link: "inquiries" },
        { id: 8, name: "AWARDS", link: "awards" },
    ];

  return (
    <>
      {/* =========================================
          HEADER
      ========================================== */}
      <header className="fixed top-0 left-0 z-50 w-full h-[76px] bg-[#FFFBEB] border-b border-slate-200 shadow-sm">
        <div className="h-full flex items-center px-6">
          {/* Brand */}
          <a
            href="https://boheco2.com.ph"
            className="flex items-center shrink-0 cursor-pointer"
          >
            <img src={img} alt="BOHECO II" className="w-12 h-12 object-contain" />
            <div className="h-10 w-[3px] bg-yellow-500 mx-4" />
            <div>
              <h1 className="font-extrabold tracking-wide text-slate-900">
                BOHECO II
              </h1>
              <p className="text-[10px] tracking-[.2em] text-emerald-700">
                SERVICES
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center ml-auto gap-1">
            {Links.map((data) => (
              <a key={data.id} href={data.link} className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700">
                {data.name}
              </a>
            ))}
            <a href="/login" className="ml-3 px-5 py-2.5 rounded-lg bg-[#FFF1BD] text-xs font-bold hover:bg-[#FFE58A]">
              LOGIN
            </a>
          </nav>

          {/* Mobile Button */}
          <button onClick={() => setOpen(!open)} className="lg:hidden ml-auto p-2 text-slate-700">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <nav className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-1 shadow-lg">
            {Links.map((data) => (
              <a key={data.id} href={data.link} className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">
                {data.name}
              </a>
            ))}
            <a href="/login" className="block text-center mt-2 px-4 py-3 rounded-lg bg-[#FFF1BD] font-bold text-sm">
              LOGIN
            </a>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;