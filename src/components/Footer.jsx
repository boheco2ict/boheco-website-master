import React from "react";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  return (
    <div className="shadow-md w-full bottom-0 left-0">
      <div className="flex justify-evenly py-4 border-b-[0.5px] border-gray-300">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1966.781703345928!2d124.35679480665894!3d9.632808081282136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33aa7220ea85d1af%3A0xb661993219e5c68d!2sBohol%20II%20Electric%20Cooperative%2C%20Inc.%20-%20Jagna%20Main%20Office!5e0!3m2!1sen!2sph!4v1699937927460!5m2!1sen!2sph"
          className="lg:block hidden p-2 bg-slate-100 bg-opacity-40 shadow-lg rounded-md"
        ></iframe>
        <div>
          {/* main */}
          <div className="p-4 bg-slate-100 bg-opcity-40 shadow-lg rounded-md">
            <div className="flex justify-center align-center text-2xl font-[Gloock] font-bold uppercase">
              Contact Us
            </div>
            {/* sub */}
            <div className="flex gap-4">
              {/* icons */}
              <div>
                <div>
                  <LocalPhoneIcon />
                </div>
                <div>
                  <EmailIcon />
                </div>
                <div>
                  <LocationOnIcon />
                </div>
              </div>
              {/* names */}
              <div>
                <div>(038) 412-1230 - 412-1239</div>
                <div>bohecojagna@yahoo.com</div>
                <div>Bohol Circumferential Road</div>
                <div>Cantagay, Jagna, 6308 Bohol, Philippines</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex flex-col items-center justify-center text-center">
        <p>© 2024 | BOHOL II ELECTRIC COOPERATIVE, INC.</p>
        <p>
          Developed by:{" "}
          <span className="text-orange-400">BOHECO II Webmaster</span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
