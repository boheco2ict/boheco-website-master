import { Link } from "react-router-dom";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  return (
    <footer
      className="
        relative
        z-0
        w-full
        border border-transparent
        bg-amber-100
        text-slate-900

        xl:pl-[calc(clamp(220px,14vw,240px)+24px)]
      "
    >
      {/* Main Footer Content */}
      <div
        className="
          w-full
          px-4
          py-5
          sm:px-6
          lg:px-8
          xl:pr-6
        "
      >
        <div
          className="
            flex
            w-full
            flex-col
            gap-4
            text-sm
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Organization */}
          <div>
            <p className="font-bold">
              BOHOL II ELECTRIC COOPERATIVE, INC.
            </p>

            <p className="text-xs text-slate-700">
              Serving members with reliable electric
              cooperative services.
            </p>
          </div>

          {/* Contact Information */}
          <div
            className="
              grid
              w-full
              gap-2
              text-xs
              sm:grid-cols-3
              lg:w-auto
              lg:min-w-[640px]
            "
          >
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
      </div>

      {/* Copyright */}
      <div
        className="
          w-full
          border-t
          border-amber-200
          px-4
          py-3
          text-center
          text-xs
          text-slate-700
          sm:px-6
          lg:px-8
          xl:pr-6
        "
      >
        <Link
          to="/developers"
          className="
            inline-flex
            items-center
            justify-center
            transition
            hover:text-amber-700
            hover:underline
          "
        >
          © {new Date().getFullYear()} BOHECO II.
          Developed by BOHECO II.
        </Link>
      </div>
    </footer>
  );
};

function FooterInfo({ icon, text }) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
        rounded-xl
        border
        border-amber-200/60
        bg-white/55
        px-3
        py-2.5
      "
    >
      <span className="shrink-0 text-amber-700">
        {icon}
      </span>

      <span className="truncate">
        {text}
      </span>
    </div>
  );
}

export default Footer;