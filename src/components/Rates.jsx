import { useState, useEffect } from "react";
import RatesTable from "./RatesTable";
import { FaBolt } from "react-icons/fa";
import { supabase } from "../supabase";

// ==========================================
// RATE CLASS VISIBILITY
// ==========================================

const showResidential = true;
const showCommercial = true;
const showIndustrial = true;

// ==========================================
// AVAILABLE RATE CLASSES
// ==========================================

const rateClasses = [
  {
    id: "residential",
    label: "Residential",
    visible: showResidential,
  },
  {
    id: "commercial",
    label: "Commercial",
    visible: showCommercial,
  },
  {
    id: "industrial",
    label: "Industrial",
    visible: showIndustrial,
  },
].filter((rateClass) => rateClass.visible);

// ==========================================
// MONTHS
// ==========================================

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

// ==========================================
// TABLE HEADER
// ==========================================

const createHeader = (year) => [
  ...months.map((month) => `${month} ${year}`),
  `AVERAGE ${year}`,
];

// ==========================================
// TABLE BODY
// ==========================================

const createBody = (rates, rateClass) => {
  const values = Array(12).fill(null);

  const selectedRates = rates?.[rateClass] || {};

  months.forEach((_, index) => {
    const monthNumber = index + 1;

    const value = selectedRates[monthNumber];

    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      const numericValue = Number(value);

      if (!Number.isNaN(numericValue)) {
        values[index] = numericValue;
      }
    }
  });

  // Only valid rates are included in the average
  const validValues = values.filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      !Number.isNaN(value)
  );

  const average =
    validValues.length > 0
      ? (
          validValues.reduce(
            (sum, value) => sum + value,
            0
          ) / validValues.length
        ).toFixed(4)
      : null;

  return [
    ...values,
    average,
  ];
};

const Rates = () => {
  const [activeYear, setActiveYear] = useState(null);

  const [rateYears, setRateYears] = useState([]);

  const [activeRateClass, setActiveRateClass] =
    useState(rateClasses[0]?.id || null);

  const [loadingRates, setLoadingRates] =
    useState(true);

  const [ratesError, setRatesError] =
    useState("");

  // ==========================================
  // LOAD POWER RATES
  // ==========================================

  useEffect(() => {
    loadRates();
  }, []);

  // ==========================================
  // SET DEFAULT YEAR
  // ==========================================

  useEffect(() => {
    if (rateYears.length > 0) {
      setActiveYear(rateYears[0].year);
    }
  }, [rateYears]);

  // ==========================================
  // LOAD POWER RATES
  // ==========================================

  const loadRates = async () => {
    try {
      setLoadingRates(true);
      setRatesError("");

      const { data, error } = await supabase
        .from("power_rate_years")
        .select(
          "id, year, pdf_url, rates"
        )
        .order("year", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Error loading power rates:",
          error
        );

        setRatesError(
          "Unable to load power rates."
        );

        return;
      }

      console.log(
        "Loaded power rates:",
        data
      );

      setRateYears(data || []);
    } catch (error) {
      console.error(
        "Unexpected error loading power rates:",
        error
      );

      setRatesError(
        "An unexpected error occurred while loading power rates."
      );
    } finally {
      setLoadingRates(false);
    }
  };

  // ==========================================
  // SELECTED YEAR
  // ==========================================

  const selectedRate = rateYears.find(
    (rate) => rate.year === activeYear
  );

  // ==========================================
  // CHANGE YEAR
  // ==========================================

  const handleYearChange = (year) => {
    setActiveYear(year);

    // Reset to first enabled rate class
    setActiveRateClass(
      rateClasses[0]?.id || null
    );
  };

  // ==========================================
  // CHANGE RATE CLASS
  // ==========================================

  const handleRateClassChange = (rateClass) => {
    setActiveRateClass(rateClass);
  };

  return (
    <div className="space-y-5">

      {/* ================================================= */}
      {/* POWER RATE SECTION                                */}
      {/* ================================================= */}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

        {/* =============================================== */}
        {/* HEADER                                          */}
        {/* =============================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2 whitespace-normal break-words text-sm font-bold uppercase tracking-wide text-amber-700">

              <FaBolt />

              Summary of Power Rates

            </div>

            <p className="mt-1 text-sm text-slate-600">
              Select a year and rate class to
              view the monthly power rates.
            </p>

          </div>

        </div>

        {/* =============================================== */}
        {/* ERROR                                           */}
        {/* =============================================== */}

        {ratesError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {ratesError}
          </div>
        )}

        {/* =============================================== */}
        {/* LOADING                                         */}
        {/* =============================================== */}

        {loadingRates ? (
          <div className="rounded-lg bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
            Loading power rates...
          </div>
        ) : rateYears.length === 0 ? (
          <div className="rounded-lg bg-slate-50 px-4 py-10 text-center text-sm font-semibold text-slate-500">
            No power rate data available.
          </div>
        ) : (
          <>

            {/* =========================================== */}
            {/* YEAR SELECTOR                               */}
            {/* =========================================== */}

<div className="mb-6">

  {/* Label */}
  <div className="mb-3 flex items-center justify-between">
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
        Rate Year
      </p>

      <p className="mt-0.5 text-xs text-slate-500">
        Select a year to view its power rates
      </p>
    </div>

    {/* {activeYear && (
      <span className="hidden rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 sm:inline-flex">
        {activeYear} Selected
      </span>
    )} */}
  </div>

  {/* Year Selector */}
  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 p-2 shadow-sm">

    <div className="flex gap-2 overflow-x-auto pb-1 pl-1 pt-1 scrollbar-thin">

      {rateYears.map((rate) => {

        const isActive =
          activeYear === rate.year;

        return (
          <button
            key={rate.id}
            type="button"
            onClick={() =>
              handleYearChange(rate.year)
            }
            aria-pressed={isActive}
            className={`
              group
              relative
              flex
              min-w-[88px]
              flex-none
              items-center
              justify-center
              rounded-xl
              px-5
              py-3
              text-sm
              font-extrabold
              transition-all
              duration-200
              focus:outline-none
              focus:ring-1
              focus:ring-amber-500
              focus:ring-offset-1
              ${
                isActive
                  ? `
                    bg-slate-900
                    text-white
                    shadow-md
                    shadow-slate-900/15
                  `
                  : `
                    bg-white
                    text-slate-600
                    border
                    border-slate-200
                    hover:border-amber-300
                    hover:bg-amber-50
                    hover:text-amber-800
                    hover:-translate-y-0.5
                    hover:shadow-sm
                  `
              }
            `}
          >

            {/* Active indicator */}
            {isActive && (
              <span className="absolute bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-amber-400" />
            )}

            <span className="relative">
              {rate.year}
            </span>

          </button>
        );

      })}

    </div>

  </div>

</div>

            {/* =========================================== */}
            {/* SELECTED YEAR                               */}
            {/* =========================================== */}

            {selectedRate && (
              <>

                {/* ======================================= */}
                {/* RATE CLASS TABS                         */}
                {/* ======================================= */}

                {rateClasses.length > 1 && (
                  <div className="mb-5 overflow-x-auto border-b border-slate-200">

                    <div className="flex min-w-max">

                      {rateClasses.map(
                        (rateClass) => {

                          const isActive =
                            activeRateClass ===
                            rateClass.id;

                          return (
                            <button
                              key={rateClass.id}
                              type="button"
                              onClick={() =>
                                handleRateClassChange(
                                  rateClass.id
                                )
                              }
                              className={`relative px-5 py-3 text-sm font-bold transition ${
                                isActive
                                  ? "text-amber-700"
                                  : "text-slate-500 hover:text-slate-900"
                              }`}
                            >

                              {rateClass.label}

                              {isActive && (
                                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-amber-500" />
                              )}

                            </button>
                          );

                        }
                      )}

                    </div>

                  </div>
                )}

                {/* ======================================= */}
                {/* RATE TABLE                              */}
                {/* ======================================= */}

                <RatesTable
                  year={selectedRate.year}
                  rateClass={activeRateClass}
                  thead={createHeader(
                    selectedRate.year
                  )}
                  tbody={createBody(
                    selectedRate.rates,
                    activeRateClass
                  )}
                  url={selectedRate.pdf_url}
                />

              </>
            )}

          </>
        )}

      </section>

    </div>
  );
};

export default Rates;