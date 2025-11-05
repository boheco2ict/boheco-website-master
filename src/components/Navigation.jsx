import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { FaTimes, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const img = ["assets/l.png"];

const Navigation = () => {
  const Links = [
    { id: 1, name: "HOME", link: "/" },
    { id: 2, name: "ABOUT", link: "about" },
    { id: 3, name: "RATE ADVISORY", link: "rate-advisory" },
    { id: 4, name: "NOTICE", link: "notice" },
    { id: 5, name: "DDP & PSPPs", link: "ddpandpspp" },
    { id: 6, name: "LIFELINE RATE", link: "lifeline" },
    { id: 7, name: "PAYMENT PARTNERS", link: "partners" },
    { id: 8, name: "BILL INQUIRIES", link: "inquiries" },
    { id: 9, name: "PRIVACY NOTICE", link: "privacy-notice" },
  ];

  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="shadow-md w-full top-0 left-0 fixed z-50">
      <div className="flex items-center justify-between bg-white py-4 px-10">
        <div className="font-bold text-2xl cursor-pointer flex items-center justify-center text-gray-800">
          <img src={img[0]} alt="logo" className="w-12 h-12" />
          <div className="px-4 sm:block hidden text-2xl ">BOHECO II</div>
          <a
            className="text-blue-600 sm:px-0 px-4"
            href="https://www.facebook.com/boheco2"
          >
            <BsFacebook size={30} />
          </a>
        </div>
        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-6 cursor-pointer 2xl:hidden"
        >
          {open ? <FaTimes /> : <FaBars />}
        </div>
        <ul
          className={`2xl:flex 2xl:item-center pb-0 absolute 2xl:static bg-white 2xl:z-auto z-[-1] left-0 w-full 2xl:w-auto 2xl:pl-0 pl-9 transition-all duration-300 ease-in ${
            open
              ? "top-20 opacity-100"
              : "top-[-490px] 2xl:opacity-100 opacity-0"
          }`}
        >
          {Links.map((link) => (
            <li key={link.id} className="ml-7 text-xl py-2">
              <NavLink
                to={link.link}
                className={({ isActive }) =>
                  isActive
                    ? "active text-gray-800 hover:text-red-600"
                    : "text-gray-800 hover:text-red-600"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navigation;
