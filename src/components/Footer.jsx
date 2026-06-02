import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  return (
    <footer className="w-full border-t border-amber-200 bg-amber-100 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-bold">BOHOL II ELECTRIC COOPERATIVE, INC.</p>
          <p className="text-xs text-slate-700">
            Serving members with reliable electric cooperative services.
          </p>
        </div>

        <div className="grid gap-2 text-xs sm:grid-cols-3 lg:min-w-[640px]">
          <FooterInfo
            icon={<LocalPhoneIcon fontSize="small" />}
            text="(038) 412-1230 - 412-1239"
          />
          <FooterInfo
            icon={<EmailIcon fontSize="small" />}
            text="bohecojagna@yahoo.com"
          />
          <FooterInfo
            icon={<LocationOnIcon fontSize="small" />}
            text="Cantagay, Jagna, Bohol"
          />
        </div>
      </div>

      <div className="border-t border-amber-200 px-4 py-2 text-center text-xs text-slate-700">
        © {new Date().getFullYear()} BOHECO II. Developed by BOHECO II.
      </div>
    </footer>
  );
};

function FooterInfo({ icon, text }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/55 px-3 py-2">
      <span className="text-amber-700">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );
}

export default Footer;
