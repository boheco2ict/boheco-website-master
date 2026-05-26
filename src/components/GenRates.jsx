const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";
const img = ["RATES/GEN/Gen1.jpg", "RATES/GEN/Gen2.jpg", "RATES/GEN/Gen3.jpg"];

const Rates = () => {
  return (
    <section>
      <div className="flex items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-6 uppercase">
        Breakdown Of Generation Charge
      </div>
      <div className="flex flex-col gap-4 items-center justify-center">
        {img.map((img, index) => (
          <img
            key={index}
            className="bg-white p-2 rounded-md shadow-lg md:w-3/5"
            draggable={false}
            src={url + img}
            alt="rate"
            width={900}
            height={900}
          />
        ))}
      </div>
    </section>
  );
};

export default Rates;
