import React from "react";

const img = ["assets/logo.png"];

const LandingPage = () => {
  return (
    <div className="container px-5 py-24 mx-auto h-screen flex items-center content-center justify-center flex-col">
      <img draggable={false} src={img[0]} alt="" className=" w-72 h-72 mb-5" />
      <div className="font-[Gloock] font-bold md:text-8xl text-5xl text-white drop-shadow-lg">
        BOHECO II
      </div>
      <div className="font-[Gloock] py-4 md:text-4xl text-lg text-gray-900 drop-shadow-lg">
        "Bringing light into the lives of our Member-Consumer-Owners (MCOs)."
      </div>
    </div>
  );
};

export default LandingPage;
