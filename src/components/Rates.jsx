import { useState, useEffect } from "react";
import RatesTable from "./RatesTable";
import { FaBolt, FaChevronLeft, FaChevronRight, FaImage } from "react-icons/fa";
import { supabase } from "../supabase";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const createHeader = (year) => [
  "RATE CLASS",
  ...months.map((month) => `${month} ${year}`),
  `AVERAGE ${year}`,
];

const createBody = (rates) => {
  const values = Array(12).fill(null);

  rates.forEach((rate) => {
    values[rate.month - 1] = Number(rate.rate);
  });

  const valid = values.filter((v) => v !== null);

  const average = (valid.reduce((sum, v) => sum + v, 0) / valid.length).toFixed(
    4
  );

  return [...values, average];
};

const Rates = () => {
  const [activeYear, setActiveYear] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [rateYears, setRateYears] = useState([]);

  const [activeAdvisory, setActiveAdvisory] = useState(0);

  useEffect(() => {
    loadRates();
    loadAdvisories();
  }, []);

  useEffect(() => {
    if (rateYears.length > 0) {
      setActiveYear(rateYears[0].year);
    }
  }, [rateYears]);

  async function loadRates() {
    const { data, error } = await supabase
      .from("power_rate_years")
      .select(
        `
            *,
            power_rates (
                month,
                rate
            )
        `
      )
      .order("year", { ascending: false });

    if (error) {
      console.log(error);
      return;
    }

    setRateYears(data);
  }

  async function loadAdvisories() {
    const { data } = await supabase
      .from("power_rate_advisories")
      .select("*")
      .order("display_order");

    setAdvisories(data);
  }

  const selectedRate = rateYears.find((rate) => rate.year === activeYear);

  const handlePrevAdvisory = () => {
    if (advisories.length === 0) return;

    setActiveAdvisory(
      (current) => (current - 1 + advisories.length) % advisories.length
    );
  };

  const handleNextAdvisory = () => {
    if (advisories.length === 0) return;

    setActiveAdvisory((current) => (current + 1) % advisories.length);
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
          year={selectedRate?.year}
          thead={createHeader(selectedRate?.year)}
          tbody={createBody(selectedRate?.power_rates || [])}
          url={selectedRate?.pdf_url}
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
            src={advisories[activeAdvisory]?.image_url}
            alt={`Power rate advisory page ${activeAdvisory + 1}`}
          />
        </div>
      </section>
    </div>
  );
};

export default Rates;
