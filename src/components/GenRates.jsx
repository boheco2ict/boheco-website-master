import { useState } from "react";
import { FaChartPie, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const url =
  "https://odmrwqsixtqedqnwbhfh.supabase.co/storage/v1/object/public/WEBSITE%20ASSETS/";
const img = ["RATES/GEN/Gen1.jpg", "RATES/GEN/Gen2.jpg", "RATES/GEN/Gen3.jpg"];

const Rates = () => {
  const [activePage, setActivePage] = useState(0);
  const handlePrevPage = () => {
    setActivePage((current) => (current - 1 + img.length) % img.length);
  };

  const handleNextPage = () => {
    setActivePage((current) => (current + 1) % img.length);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-amber-700">
            <FaChartPie />
            Breakdown of Generation Charge
          </div>
          <p className="mt-1 text-sm text-slate-600">
            View one generation-charge page at a time for easier reading.
          </p>
        </div>

        <div className="flex items-center gap-2 pb-1">
          <button
            type="button"
            onClick={handlePrevPage}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 transition hover:bg-amber-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Previous generation charge page"
          >
            <FaChevronLeft />
          </button>

          <div className="min-w-[110px] rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-bold text-white">
            Page {activePage + 1}
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700 transition hover:bg-amber-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Next generation charge page"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3">
        <img
          className="mx-auto max-h-[720px] w-full rounded-md bg-white object-contain shadow-sm"
          draggable={false}
          src={url + img[activePage]}
          alt={`Generation charge page ${activePage + 1}`}
          width={900}
          height={900}
        />
      </div>
    </section>
  );
};

export default Rates;
