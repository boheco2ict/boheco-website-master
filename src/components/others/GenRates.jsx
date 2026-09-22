import { useState } from "react";
import { formatName_FN_MI_LN, formatDateComplete } from "../../utils/utils";
import {
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoiceDollar,
  FaExpandAlt,
} from "react-icons/fa";
import { UserRound, Clock3 } from "lucide-react";

const GenRates = ({ generationCharges, loadingCharges, chargesError }) => {
  const [activePage, setActivePage] = useState(0);

  // PREVIOUS PAGE
  const handlePrevPage = () => {
    if (generationCharges.length === 0) {
      return;
    }

    setActivePage(
      (current) => (current - 1 + generationCharges.length) % generationCharges.length
    );
  };

  // NEXT PAGE
  const handleNextPage = () => {
    if (generationCharges.length === 0) {
      return;
    }

    setActivePage((current) => (current + 1) % generationCharges.length);
  };

  // ACTIVE GENERATION CHARGE
  const activeGenerationCharge = generationCharges[activePage];

  if (loadingCharges) {
    return <div></div>;
  }

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* HEADER */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* TITLE */}
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-sm">
              <FaChartPie className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Breakdown of Generation Charge
              </h2>
              <p className="mt-0.5 text-sm text-slate-300">
                Review the generation charge rate breakdown.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-6">
        {/* LOADING */}
        {loadingCharges && (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-amber-500" />
              <p className="text-sm font-semibold text-slate-500">
                Loading generation charge...
              </p>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loadingCharges && !chargesError && generationCharges.length === 0 && (
          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 px-6 text-center">
            <div>
              <FaFileInvoiceDollar className="mx-auto text-3xl text-slate-400" />
              <p className="mt-3 text-sm font-semibold text-slate-600">
                No generation charge information available.
              </p>
            </div>
          </div>
        )}

        {/* GENERATION CHARGE — full-bleed image with overlaid nav + caption */}
        {!loadingCharges && !chargesError && generationCharges.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* IMAGE STAGE */}
            <div className="relative w-full">
              <div className="relative mx-auto flex max-h-[70vh] min-h-[320px] items-center justify-center overflow-hidden">
                <img
                  className="max-h-[70vh] w-full select-none object-contain"
                  draggable={false}
                  src={activeGenerationCharge?.image_url}
                  alt={`Generation charge breakdown page ${activeGenerationCharge?.display_order}`}
                />

                {/* PREVIOUS — overlaid on image */}
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={generationCharges.length <= 1}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-700 text-slate-50 shadow-md backdrop-blur transition hover:bg-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-0"
                  aria-label="Previous generation charge page"
                >
                  <FaChevronLeft className="text-sm" />
                </button>

                {/* NEXT — overlaid on image */}
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={generationCharges.length <= 1}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-700 text-slate-50 shadow-md backdrop-blur transition hover:bg-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-0"
                  aria-label="Next generation charge page"
                >
                  <FaChevronRight className="text-sm" />
                </button>

                {/* BOTTOM GRADIENT CAPTION */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-4 py-3 text-[10px] text-white sm:px-5 sm:py-4">
                  <div className="flex items-center gap-1.5">
                    <UserRound className="h-3 w-3 shrink-0" />
                    <span>
                      {formatName_FN_MI_LN(
                        activeGenerationCharge?.posted_by_employee_id?.firstname,
                        activeGenerationCharge?.posted_by_employee_id?.middlename,
                        activeGenerationCharge?.posted_by_employee_id?.lastname
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3 w-3 shrink-0" />
                    <span>
                      {formatDateComplete(activeGenerationCharge?.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER — counter + open full image */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{activePage + 1}</span> of{" "}
                {generationCharges.length}
              </span>

              <a
                href={activeGenerationCharge?.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
              >
                Open Full Image
                <FaExpandAlt className="text-xs" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GenRates;
