const img = [
  "assets/rates/april2026/Slide6.jpg",
  "assets/rates/march2026/Slide6.jpeg",
  "assets/rates/february2026/Slide6.png",
];

const months = ["April", "March", "February"];
const year = 2026;

const Rates = () => {
  return (
    <section>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[0]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[0]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[1]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[1]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[2]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={img[2]} alt="rate" />
      </div>
    </section>
  );
};

export default Rates;
