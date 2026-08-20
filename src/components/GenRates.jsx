import { useEffect, useState } from "react";
import {
  FaChartPie,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoiceDollar,
} from "react-icons/fa";

import { getGenerationCharges } from "../services/getservices";

const GenRates = () => {
  const [generationCharges, setGenerationCharges] =
    useState([]);

  const [activePage, setActivePage] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD GENERATION CHARGES
  // ==========================================

  useEffect(() => {
    loadGenerationCharges();
  }, []);

  const loadGenerationCharges = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getGenerationCharges();

      setGenerationCharges(data || []);

    } catch (error) {
      console.error(
        "Error loading generation charges:",
        error
      );

      setError(
        "Unable to load the generation charge breakdown."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PREVIOUS PAGE
  // ==========================================

  const handlePrevPage = () => {
    if (generationCharges.length === 0) {
      return;
    }

    setActivePage(
      (current) =>
        (current - 1 + generationCharges.length) %
        generationCharges.length
    );
  };

  // ==========================================
  // NEXT PAGE
  // ==========================================

  const handleNextPage = () => {
    if (generationCharges.length === 0) {
      return;
    }

    setActivePage(
      (current) =>
        (current + 1) %
        generationCharges.length
    );
  };

  // ==========================================
  // ACTIVE GENERATION CHARGE
  // ==========================================

  const activeGenerationCharge =
    generationCharges[activePage];

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

          {/* TOP CONTROLS */}

          <div className="flex items-center gap-2 self-start sm:self-auto">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={handlePrevPage}
              disabled={
                generationCharges.length === 0
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous generation charge page"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            {/* PAGE COUNTER */}

            <div className="flex h-10 min-w-[100px] items-center justify-center rounded-lg border border-slate-600 bg-slate-950/60 px-4">

              <span className="text-sm font-semibold text-white">
                {generationCharges.length > 0
                  ? activePage + 1
                  : 0}
              </span>

              <span className="mx-1.5 text-slate-500">
                /
              </span>

              <span className="text-sm font-medium text-slate-400">
                {generationCharges.length}
              </span>

            </div>

            {/* NEXT */}

            <button
              type="button"
              onClick={handleNextPage}
              disabled={
                generationCharges.length === 0
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-slate-200 transition-all duration-200 hover:border-amber-400 hover:bg-amber-400 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next generation charge page"
            >
              <FaChevronRight className="text-sm" />
            </button>

          </div>

        </div>

      </div>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="p-4 sm:p-6">

        {/* ======================================
            LOADING
        ====================================== */}

        {loading && (

          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-slate-100">

            <div className="flex flex-col items-center gap-3">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-amber-500" />

              <p className="text-sm font-semibold text-slate-500">
                Loading generation charge...
              </p>

            </div>

          </div>

        )}

        {/* ======================================
            ERROR
        ====================================== */}

        {!loading && error && (

          <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-red-200 bg-red-50 px-6 text-center">

            <div>

              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={loadGenerationCharges}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          </div>

        )}

        {/* ======================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          generationCharges.length === 0 && (

            <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 px-6 text-center">

              <div>

                <FaFileInvoiceDollar className="mx-auto text-3xl text-slate-400" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No generation charge information available.
                </p>

              </div>

            </div>

          )}

        {/* ======================================
            GENERATION CHARGE
        ====================================== */}

        {!loading &&
          !error &&
          generationCharges.length > 0 && (

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

              {/* DOCUMENT HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">

                <div className="flex items-center gap-2">

                  <FaFileInvoiceDollar className="text-sm text-amber-500" />

                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Generation Charge Rate
                  </span>

                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Page{" "}
                  {
                    activeGenerationCharge
                      ?.display_order
                  }
                </span>

              </div>

              {/* IMAGE */}

              <div className="flex justify-center bg-slate-100 p-3 sm:p-5">

                <div className="w-full overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-slate-200">

                  <img
                    className="mx-auto max-h-[720px] w-full object-contain"
                    draggable={false}
                    src={
                      activeGenerationCharge?.image_url
                    }
                    alt={`Generation charge breakdown page ${
                      activeGenerationCharge?.display_order
                    }`}
                    width={900}
                    height={900}
                  />

                </div>

              </div>

              {/* ========================================
                  BOTTOM NAVIGATION
              ======================================== */}

              <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={
                    generationCharges.length <= 1
                  }
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronLeft className="text-xs" />

                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </button>

                {/* DOT INDICATORS */}

                <div
                  className="flex items-center gap-1.5"
                  aria-label="Generation charge pages"
                >

                  {generationCharges.map(
                    (generationCharge, index) => (

                      <button
                        key={
                          generationCharge.id
                        }
                        type="button"
                        onClick={() =>
                          setActivePage(index)
                        }
                        aria-label={`View generation charge page ${generationCharge.display_order}`}
                        aria-current={
                          index === activePage
                            ? "true"
                            : undefined
                        }
                        className={`h-2 rounded-full transition-all duration-200 ${
                          index === activePage
                            ? "w-6 bg-amber-500"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                      />

                    )
                  )}

                </div>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    generationCharges.length <= 1
                  }
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
                >

                  <span className="hidden sm:inline">
                    Next
                  </span>

                  <FaChevronRight className="text-xs" />

                </button>

              </div>

            </div>

          )}

      </div>

    </section>
  );
};

export default GenRates;