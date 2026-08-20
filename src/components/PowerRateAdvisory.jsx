import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaImage,
  FaBolt,
} from "react-icons/fa";
import { getPowerAdvisories } from "../services/getservices";

const PowerRateAdvisory = () => {
  const [advisories, setAdvisories] = useState([]);
  const [activeAdvisory, setActiveAdvisory] = useState(0);
  const [loadingAdvisories, setLoadingAdvisories] = useState(true);
  const [advisoryError, setAdvisoryError] = useState("");

  // ==========================================
  // LOAD ADVISORIES
  // ==========================================

  useEffect(() => {
    loadAdvisories();
  }, []);

  const loadAdvisories = async () => {
    try {
      setLoadingAdvisories(true);
      setAdvisoryError("");

      const data = await getPowerAdvisories();

      setAdvisories(data || []);
      setActiveAdvisory(0);
    } catch (error) {
      console.error(
        "Unexpected error loading advisories:",
        error
      );

      setAdvisoryError(
        "Unable to load the power rate advisories. Please try again later."
      );
    } finally {
      setLoadingAdvisories(false);
    }
  };

  // ==========================================
  // PREVIOUS ADVISORY
  // ==========================================

  const handlePrevAdvisory = () => {
    if (advisories.length === 0) return;

    setActiveAdvisory(
      (current) =>
        (current - 1 + advisories.length) %
        advisories.length
    );
  };

  // ==========================================
  // NEXT ADVISORY
  // ==========================================

  const handleNextAdvisory = () => {
    if (advisories.length === 0) return;

    setActiveAdvisory(
      (current) =>
        (current + 1) % advisories.length
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-5 sm:px-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* TITLE */}

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-sm">
              <FaBolt className="text-lg" />
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

          {/* CONTROLS */}

          {!loadingAdvisories && advisories.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={handlePrevAdvisory}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Previous advisory"
              >
                <FaChevronLeft className="text-sm" />
              </button>

              {/* PAGE INDICATOR */}

              <div className="flex h-10 min-w-[100px] items-center justify-center rounded-lg border border-slate-600 bg-slate-950/60 px-4">

                <span className="text-sm font-semibold text-white">
                  {activeAdvisory + 1}
                </span>

                <span className="mx-1.5 text-slate-500">
                  /
                </span>

                <span className="text-sm font-medium text-slate-400">
                  {advisories.length}
                </span>

              </div>

              {/* NEXT */}

              <button
                type="button"
                onClick={handleNextAdvisory}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                aria-label="Next advisory"
              >
                <FaChevronRight className="text-sm" />
              </button>

            </div>
          )}

        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {advisoryError && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">

            <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to load advisories
              </p>

              <p className="mt-0.5 text-sm text-red-600">
                {advisoryError}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="p-4 sm:p-6">

        {/* LOADING */}

        {loadingAdvisories ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50">

            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />

            <p className="text-sm font-semibold text-slate-700">
              Loading power rate advisory
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait a moment...
            </p>

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
              There are currently no published power rate
              advisories to display.
            </p>

          </div>

        ) : (

          /* ADVISORY */

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

            {/* IMAGE HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">

              <div className="flex items-center gap-2">

                <FaImage className="text-sm text-amber-500" />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Advisory Document
                </span>

              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Page {activeAdvisory + 1}
              </span>

            </div>

            {/* IMAGE */}

            <div className="flex justify-center bg-slate-100 p-3 sm:p-5">

              <div className="w-full overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-slate-200">

                <img
                  className="mx-auto max-h-[720px] w-full object-contain"
                  draggable={false}
                  src={
                    advisories[activeAdvisory]?.image_url
                  }
                  alt={`Power rate advisory page ${
                    activeAdvisory + 1
                  }`}
                />

              </div>

            </div>

            {/* BOTTOM NAVIGATION */}

            {advisories.length > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">

                <button
                  type="button"
                  onClick={handlePrevAdvisory}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <FaChevronLeft className="text-xs" />
                  Previous
                </button>

                {/* DOT INDICATORS */}

                <div className="flex items-center gap-1.5">

                  {advisories.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setActiveAdvisory(index)
                      }
                      aria-label={`View advisory ${index + 1}`}
                      aria-current={
                        index === activeAdvisory
                          ? "true"
                          : undefined
                      }
                      className={`h-2 rounded-full transition-all duration-200 ${
                        index === activeAdvisory
                          ? "w-6 bg-amber-500"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}

                </div>

                <button
                  type="button"
                  onClick={handleNextAdvisory}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>

              </div>
            )}

          </div>
        )}

      </div>

    </section>
  );
};

export default PowerRateAdvisory;