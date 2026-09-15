const img = ["/assets/m.jpeg", "/assets/v.jpeg"];

const Section = () => {
  return (
    <section className="container px-5 py-24 mx-auto">
      {/* Mission */}
      <div className="flex flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:w-1/2 text-3xl mb-3 px-4">
          <h1 className="text-3xl font-[Gloock] font-bold px-4 py-2 sm:text-4xl">
            Our Mission
          </h1>
          <p className="font-[Gloock] text-base leading-relaxed sm:text-lg sm:leading-8">
            To sustain a
            <span className="block text-3xl font-[Pacifico] italic text-cyan-800 px-0 py-2 sm:text-4xl">
              quality electric service
            </span>
            while contributing to the
            <span className="block text-3xl font-[Pacifico] italic text-cyan-800 px-0 py-2 sm:text-4xl">
              economic growth
            </span>
            of the Province of Bohol.
          </p>
        </div>
        <img
          draggable={false}
          className="w-full lg:w-[46%] h-72 sm:h-80 lg:h-96 object-cover object-center bg-white p-4 rounded-lg"
          src={img[0]}
          alt="mission"
        />
      </div>
      {/* Vision */}
      <div className="flex flex-col gap-6 px-4 py-10 lg:flex-row-reverse lg:items-center lg:justify-between">
        <div className="w-full lg:w-1/2 text-3xl mb-3 px-4">
          <h1 className="text-3xl font-[Gloock] font-bold px-4 py-2 sm:text-4xl">
            Our Vision
          </h1>
          <p className="font-[Gloock] text-base leading-relaxed sm:text-lg sm:leading-8">
            A
            <span className="block text-3xl font-[Pacifico] italic text-cyan-800 px-0 py-2 sm:text-4xl">
              highly competetive
            </span>
            utility that
            <span className="block text-3xl font-[Pacifico] italic text-cyan-800 px-0 py-2 sm:text-4xl">
              ensures
            </span>
            member consumer owners
            <span className="block text-3xl font-[Pacifico] italic text-cyan-800 px-0 py-2 sm:text-4xl">
              satisfaction.
            </span>
          </p>
        </div>
        <img
          draggable={false}
          className="w-full lg:w-[46%] h-72 sm:h-80 lg:h-96 object-cover object-center bg-white p-4 rounded-lg"
          src={img[1]}
          alt="vision"
        />
      </div>
    </section>
  );
};

export default Section;
