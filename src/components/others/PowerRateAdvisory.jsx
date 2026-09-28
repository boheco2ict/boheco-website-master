import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaChartLine,
  FaExpandAlt,
} from "react-icons/fa";
import { UserRound, Clock3 } from "lucide-react";
import { formatName_FN_MI_LN, formatDateComplete } from "../../utils/utils";

const PowerRateAdvisory = ({ advisories, loadingAdvisories, advisoryError }) => {
  const [activeAdvisory, setActiveAdvisory] = useState(0);

  // PREVIOUS ADVISORY
  const handlePrevAdvisory = () => {
    if (advisories.length === 0) return;
    setActiveAdvisory(
      (current) => (current - 1 + advisories.length) % advisories.length
    );
  };

  // NEXT ADVISORY
  const handleNextAdvisory = () => {
    if (advisories.length === 0) return;
    setActiveAdvisory((current) => (current + 1) % advisories.length);
  };

  // ACTIVE ADVISORY
  const activeAdvisoryItem = advisories?.[activeAdvisory];

  if (loadingAdvisories) {
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
              <FaChartLine className="text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Power Rate Advisory
              </h2>
              <p className="mt-0.5 text-sm text-slate-300">
                View the latest electricity rate advisories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {advisoryError && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load advisories
              </p>
              <p className="mt-0.5 text-sm text-red-600">{advisoryError}</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-4 sm:p-6">
        {/* LOADING */}
        {loadingAdvisories ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
            <p className="text-sm font-semibold text-slate-700">
              Loading power rate advisory
            </p>
            <p className="mt-1 text-xs text-slate-500">Please wait a moment...</p>
          </div>
        ) : advisories.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
              <FaImage className="text-2xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No advisory available
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              There are currently no published power rate advisories to display.
            </p>
          </div>
        ) : (
          /* ADVISORY — full-bleed image with overlaid nav + caption */
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* IMAGE STAGE */}
            <div className="relative w-full">
              <div className="relative mx-auto flex max-h-[70vh] min-h-[320px] items-center justify-center overflow-hidden">
                <img
                  className="max-h-[70vh] w-full select-none object-contain"
                  draggable={false}
                  src={activeAdvisoryItem?.image_url}
                  alt={`Power rate advisory page ${activeAdvisory + 1}`}
                />

                {/* PREVIOUS — overlaid on image */}
                <button
                  type="button"
                  onClick={handlePrevAdvisory}
                  disabled={advisories.length <= 1}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-700 text-slate-50 shadow-md backdrop-blur transition hover:bg-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-0"
                  aria-label="Previous advisory"
                >
                  <FaChevronLeft className="text-sm" />
                </button>

                {/* NEXT — overlaid on image */}
                <button
                  type="button"
                  onClick={handleNextAdvisory}
                  disabled={advisories.length <= 1}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-700 text-slate-50 shadow-md backdrop-blur transition hover:bg-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-0"
                  aria-label="Next advisory"
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
                        activeAdvisoryItem?.posted_by_employee_id?.firstname,
                        activeAdvisoryItem?.posted_by_employee_id?.middlename,
                        activeAdvisoryItem?.posted_by_employee_id?.lastname
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 className="h-3 w-3 shrink-0" />
                    <span>
                      {formatDateComplete(activeAdvisoryItem?.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER — counter + open full advisory */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-5">
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {activeAdvisory + 1}
                </span>{" "}
                of {advisories.length}
              </span>

              <a
                href={activeAdvisoryItem?.image_url}
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

export default PowerRateAdvisory;
