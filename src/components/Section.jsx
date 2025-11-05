import React from "react";

const img = ["/assets/m.jpeg", "/assets/v.jpeg"];

const Section = () => {
  return (
    <section className="container px-5 py-24 mx-auto">
      {/* Mission */}
      <div className="flex items-center justify-between px-4 py-10">
        <div className="text-3xl mb-3 px-4">
          <h1 className="text-4xl font-[Gloock] font-bold  flex justify-end px-4 py-2">
            Our Mission
          </h1>
          <p className="font-[Gloock]">
            To sustain a
            <span className="text-4xl font-[Pacifico] italic text-cyan-800 px-4">
              quality electric service
            </span>
            while contributing to the
            <span className="text-4xl font-[Pacifico] italic text-cyan-800 px-4">
              economic growth
            </span>
            of the Province of Bohol.
          </p>
        </div>
        <img
          draggable={false}
          className="lg:block hidden lg:h-96 object-cover object-center px-4 bg-white p-4 rounded-lg"
          src={img[0]}
          alt="mission"
        />
      </div>
      {/* Vision */}
      <div className="flex flex-row-reverse items-center justify-between px-4 py-10">
        <div className="text-3xl mb-3 px-4">
          <h1 className="text-4xl font-[Gloock] font-bold px-4 py-2">
            Our Vision
          </h1>
          <p className="font-[Gloock]">
            A
            <span className="text-4xl font-[Pacifico] italic text-cyan-800 px-4">
              highly competetive
            </span>
            utility that
            <span className="text-4xl font-[Pacifico] italic text-cyan-800 px-4">
              ensures
            </span>
            member consumer owners
            <span className="text-4xl font-[Pacifico] italic text-cyan-800 px-4">
              satisfaction.
            </span>
          </p>
        </div>
        <img
          draggable={false}
          className="lg:block hidden lg:h-96 object-cover object-center px-4 bg-white p-4 rounded-lg"
          src={img[1]}
          alt="vision"
        />
      </div>
    </section>
  );
};

export default Section;
