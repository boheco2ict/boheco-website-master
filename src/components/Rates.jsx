import { useMemo, useState } from "react";
import RatesTable from "./RatesTable";
import { FaBolt, FaChevronLeft, FaChevronRight, FaImage } from "react-icons/fa";

const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";

const img = [
  "RATES/POWER/Power1.jpg",
  "RATES/POWER/Power2.jpg",
  "RATES/POWER/Power3.jpg",
  "RATES/POWER/Power4.jpg",
  "RATES/POWER/Power5.jpg",
];

const v26 = [
  12.7371,
  11.9444,
  11.7416,
  12.2367,
  11.9856,
  12.9893,
  null,
  null,
  null,
  null,
  null,
  null,
];

const v25 = [
  12.1276, 12.1722, 12.1571, 12.2459, 11.7797, 10.8995, 11.2969, 11.4375,
  12.4851, 11.9606, 12.3215, 12.1927,
];

const v24 = [
  10.3272, 10.2636, 10.2951, 10.9064, 11.7569, 9.4893, 10.2697, 13.9642,
  13.3436, 11.9938, 12.2191, 12.0691,
];

const v23 = [
  11.5472, 13.3037, 12.3968, 12.4197, 12.2549, 13.2443, 13.6768, 13.8465,
  14.1532, 12.3757, 13.9001, 10.795,
];

const v22 = [
  11.7628, 19.2901, 15.4101, 11.6674, 12.998, 13.1694, 13.919, 13.1891, 13.8792,
  13.8352, 14.0901, 13.6085,
];

const withAverage = (array) => {
  const nonNullValues = array.filter((val) => val !== null);
  const average = (
    nonNullValues.reduce((acc, val) => acc + val, 0) / nonNullValues.length
  ).toFixed(4);

  return [...array, average];
};

const thead2026 = [
  "RATE CLASS",
  "JAN 2026",
  "FEB 2026",
  "MAR 2026",
  "APR 2026",
  "MAY 2026",
  "JUN 2026",
  "JUL 2026",
  "AUG 2026",
  "SEP 2026",
  "OCT 2026",
  "NOV 2026",
  "DEC 2026",
  "AVERAGE 2026",
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

const Rates = () => {
  const rateYears = useMemo(
    () => [
      {
        year: "2026",
        thead: thead2026,
        tbody: withAverage(v26),
        url: "https://drive.google.com/file/d/1ryeVnQ9zFAS_OxVy_D8ghoazWhXpMzj5/view?usp=sharing",
      },
      {
        year: "2025",
        thead: thead2025,
        tbody: withAverage(v25),
        url: "https://drive.google.com/file/d/1ryeVnQ9zFAS_OxVy_D8ghoazWhXpMzj5/view?usp=sharing",
      },
      {
        year: "2024",
        thead: thead2024,
        tbody: withAverage(v24),
        url: "https://drive.google.com/file/d/1EnfEQhjvfBhcOaDS2S94_QOOOqc1tj9H/view?usp=sharing",
      },
      {
        year: "2023",
        thead: thead2023,
        tbody: withAverage(v23),
        url: "https://drive.google.com/file/d/1gHc-snjlUD_XSU-OCC3ebZAZ_T_j1vRN/view?usp=sharing",
      },
      {
        year: "2022",
        thead: thead2022,
        tbody: withAverage(v22),
        url: "https://drive.google.com/file/d/1GJTuPViBtxkwIefzy_qDOI8I7btFhWs6/view?usp=sharing",
      },
    ],
    []
  );
  const [activeYear, setActiveYear] = useState(rateYears[0].year);
  const [activeAdvisory, setActiveAdvisory] = useState(0);
  const selectedRate = rateYears.find((rate) => rate.year === activeYear);
  const handlePrevAdvisory = () => {
    setActiveAdvisory((current) => (current - 1 + img.length) % img.length);
  };

  const handleNextAdvisory = () => {
    setActiveAdvisory((current) => (current + 1) % img.length);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-700 whitespace-normal break-words">
              <FaBolt />
              Summary of Power Rates
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Select a year to view the residential monthly rate table.
            </p>
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {rateYears.map((rate) => {
            const isActive = activeYear === rate.year;

            return (
              <button
                key={rate.year}
                type="button"
                onClick={() => setActiveYear(rate.year)}
                className={`flex-none rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-slate-950"
                }`}
              >
                {rate.year}
              </button>
            );
          })}
        </div>

        <RatesTable
          year={selectedRate.year}
          thead={selectedRate.thead}
          tbody={selectedRate.tbody}
          url={selectedRate.url}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-700">
              <FaImage />
              Power Rate Advisory
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Use the arrow buttons to switch advisory pages.
            </p>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button
              type="button"
              onClick={handlePrevAdvisory}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 transition hover:bg-amber-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Previous advisory page"
            >
              <FaChevronLeft />
            </button>

            <div className="min-w-[110px] rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white">
              Page {activeAdvisory + 1}
            </div>

            <button
              type="button"
              onClick={handleNextAdvisory}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 transition hover:bg-amber-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label="Next advisory page"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3">
          <img
            className="mx-auto max-h-[720px] w-full rounded-md bg-white object-contain shadow-sm"
            draggable={false}
            src={url + img[activeAdvisory]}
            alt={`Power rate advisory page ${activeAdvisory + 1}`}
          />
        </div>
      </section>
    </div>
  );
};

export default Rates;
