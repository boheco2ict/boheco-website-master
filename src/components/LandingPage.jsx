import React from "react";
import { NavLink } from "react-router-dom";

const img = ["/assets/bohecslog.png"];

const LandingPage = () => {
  return (
    <header className="container px-5 pt-4 pb-12 mx-auto min-h-[56vh] flex items-center justify-center flex-col text-center">
      <img
        draggable={false}
        src={img[0]}
        alt="BOHECO II logo"
        className="w-40 h-auto md:w-56 md:h-auto mb-4 bg-transparent drop-shadow-[0_0_24px_rgba(252,211,77,0.6)] object-contain"
      />

      <h1 className="font-extrabold md:text-6xl text-3xl text-slate-900 leading-tight">
        BOHECO II
      </h1>

      <p className="mt-3 max-w-2xl text-base md:text-xl text-slate-700">
        Bringing light into the lives of our Member-Consumer-Owners (MCOs).
      </p>

      <nav className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <NavLink
          to="/rate-advisory"
          className="inline-flex items-center justify-center rounded-md bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="View rate advisory"
        >
          View Rates
        </NavLink>

        <NavLink
          to="/inquiries"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="View bill inquiries"
        >
          Bill Inquiries
        </NavLink>

      </nav>
    </header>
  );
};

export default LandingPage;
