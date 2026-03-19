const img = [
  "assets/rates/march2026/Slide6.jpeg",
  "assets/rates/february2026/Slide6.png",
  "assets/rates/january2026/Slide5.JPG",
];

const months = ["March", "February", "January"];

const Rates = () => {
  return (
    <section>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[0]} 2025
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[0]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[1]} 2025
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[1]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[2]} 2025
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[2]} alt="rate" />
      </div>
    </section>
  );
};

export default Rates;
