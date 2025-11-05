import RatesTable from "./RatesTable";

const img = [
  "assets/rates/october2025/slide1.jpg",
  "assets/rates/october2025/slide2.jpg",
  "assets/rates/october2025/slide3.jpg",
  "assets/rates/october2025/slide4.jpg",
];

const thead2025 = [
  "RATE CLASS",
  "JAN 2025",
  "FEB 2025",
  "MAR 2025",
  "APR 2025",
  "MAY 2025",
  "JUN 2025",
  "JUL 2025",
  "AUG 2025",
  "SEP 2025",
  "OCT 2025",
  "NOV 2025",
  "DEC 2025",
  "AVERAGE 2025",
];

const thead2024 = [
  "RATE CLASS",
  "JAN 2024",
  "FEB 2024",
  "MAR 2024",
  "APR 2024",
  "MAY 2024",
  "JUN 2024",
  "JUL 2024",
  "AUG 2024",
  "SEP 2024",
  "OCT 2024",
  "NOV 2024",
  "DEC 2024",
  "AVERAGE 2024",
];

const thead2023 = [
  "RATE CLASS",
  "JAN 2023",
  "FEB 2023",
  "MAR 2023",
  "APR 2023",
  "MAY 2023",
  "JUN 2023",
  "JUL 2023",
  "AUG 2023",
  "SEP 2023",
  "OCT 2023",
  "NOV 2023",
  "DEC 2023",
  "AVERAGE 2024",
];

const thead2022 = [
  "RATE CLASS",
  "JAN 2022",
  "FEB 2022",
  "MAR 2022",
  "APR 2022",
  "MAY 2022",
  "JUN 2022",
  "JUL 2022",
  "AUG 2022",
  "SEP 2022",
  "OCT 2022",
  "NOV 2022",
  "DEC 2022",
  "AVERAGE 2022",
];

const tbody2025 = [
  "RESIDENTIAL",
  "12.1276",
  "12.1722",
  "12.1571",
  "12.2459",
  "11.7797",
  "10.8995",
  "11.2969",
  "11.4375",
  "12.4851",
  "11.9606",
  "",
  "",
  "11.8562",
];

const tbody2024 = [
  "RESIDENTIAL",
  "10.3272",
  "10.2636",
  "10.2951",
  "10.9064",
  "11.7569",
  "9.4893",
  "10.2697",
  "13.9642",
  "13.3436",
  "11.9938",
  "12.2191",
  "12.0691",
  "11.4082",
];

const tbody2023 = [
  "RESIDENTIAL",
  "11.5472",
  "13.3037",
  "12.3968",
  "12.4197",
  "12.2549",
  "13.2443",
  "13.6768",
  "13.8465",
  "14.1532",
  "12.3757",
  "13.9001",
  "10.7950",
  "12.8262",
];

const tbody2022 = [
  "RESIDENTIAL",
  "11.7628",
  "19.2901",
  "15.4101",
  "11.6674",
  "12.9980",
  "13.1694",
  "13.9190",
  "13.1891",
  "13.8792",
  "13.8352",
  "14.0901",
  "13.6085",
  "13.9016",
];

const Rates = () => {
  return (
    <>
      <section className="overflow-x-auto p-4">
        <div className="flex items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-5 uppercase">
          Summary of Power Rates
        </div>
        <hr />
        <RatesTable
          year={"2025"}
          thead={thead2025}
          tbody={tbody2025}
          url={
            "https://drive.google.com/file/d/1ryeVnQ9zFAS_OxVy_D8ghoazWhXpMzj5/view?usp=sharing"
          }
        />
        <hr />
        <RatesTable
          year={"2024"}
          thead={thead2024}
          tbody={tbody2024}
          url={
            "https://drive.google.com/file/d/1EnfEQhjvfBhcOaDS2S94_QOOOqc1tj9H/view?usp=sharing"
          }
        />
        <hr />
        <RatesTable
          year={"2023"}
          thead={thead2023}
          tbody={tbody2023}
          url={
            "https://drive.google.com/file/d/1gHc-snjlUD_XSU-OCC3ebZAZ_T_j1vRN/view?usp=sharing"
          }
        />
        <hr />
        <RatesTable
          year={"2022"}
          thead={thead2022}
          tbody={tbody2022}
          url={
            "https://drive.google.com/file/d/1GJTuPViBtxkwIefzy_qDOI8I7btFhWs6/view?usp=sharing"
          }
        />
        <hr />
      </section>
      <section>
        <div className="flex items-center justify-center text-xl py-2 md:text-2xl lg:text-4xl font-[Gloock] font-extrabold lg:py-5 uppercase">
          Power Rate Advisory
        </div>
        <div className="flex gap-4 flex-col items-center justify-center">
          {img.map((img, index) => (
            <img
              key={index}
              className="bg-white p-2 rounded-md shadow-lg md:w-3/5"
              draggable={false}
              src={img}
              alt="rate"
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Rates;
