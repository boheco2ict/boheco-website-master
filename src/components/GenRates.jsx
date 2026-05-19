const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";
const img = ["RATES/GEN/Gen1.jpg", "RATES/GEN/Gen2.jpg", "RATES/GEN/Gen3.jpg"];

const months = ["April", "March", "February"];
const year = 2026;

const Rates = () => {
  return (
    <section>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[0]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={url + img[0]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[1]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={url + img[1]} alt="rate" />
      </div>
      <div className="flex items-center justify-center text-xl py-12 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-12 uppercase">
        Breakdown Of Generation Charge For The Month Of {months[2]} {year}
      </div>
      <div className="flex flex-col items-center justify-center">
        <img draggable={false} src={url + img[2]} alt="rate" />
      </div>
    </section>
  );
};

export default Rates;
