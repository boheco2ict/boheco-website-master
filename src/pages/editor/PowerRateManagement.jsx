import { useEffect, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaFilePdf,
} from "react-icons/fa";

import { getPowerRateYears } from "../../services/getservices";
import { updatePowerRateYear } from "../../services/updateservices";
import { createPowerRateYear } from "../../services/postservices";

const MONTHS = [
  { number: 1, name: "January", short: "JAN" },
  { number: 2, name: "February", short: "FEB" },
  { number: 3, name: "March", short: "MAR" },
  { number: 4, name: "April", short: "APR" },
  { number: 5, name: "May", short: "MAY" },
  { number: 6, name: "June", short: "JUN" },
  { number: 7, name: "July", short: "JUL" },
  { number: 8, name: "August", short: "AUG" },
  { number: 9, name: "September", short: "SEP" },
  { number: 10, name: "October", short: "OCT" },
  { number: 11, name: "November", short: "NOV" },
  { number: 12, name: "December", short: "DEC" },
];

const RATE_CLASSES = [
  {
    id: "residential",
    label: "Residential",
  },
  {
    id: "commercial",
    label: "Commercial",
  },
  {
    id: "industrial",
    label: "Industrial",
  },
];

const EMPTY_RATES = {
  commercial: {},
  industrial: {},
  residential: {},
};

function PowerRateManagement() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [rates, setRates] = useState(EMPTY_RATES);
  const [activeRateClass, setActiveRateClass] = useState("residential");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Add year modal
  const [showAddYear, setShowAddYear] = useState(false);

  // Edit year modal
  const [showEditYear, setShowEditYear] = useState(false);

  const [yearForm, setYearForm] = useState({
    year: "",
    pdf_url: "",
  });

  // --------------------------------------------------
  // Load Years
  // --------------------------------------------------

  useEffect(() => {
    loadYears();
  }, []);

  const loadYears = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPowerRateYears();

      const loadedYears = data || [];

      const sortedYears = [...loadedYears].sort(
        (a, b) => Number(b.year) - Number(a.year)
      );

      setYears(sortedYears);

      if (sortedYears.length > 0) {
        const firstYear = sortedYears[0];

        setSelectedYear(firstYear);

        setRates({
          commercial: firstYear.rates?.commercial || {},
          industrial: firstYear.rates?.industrial || {},
          residential: firstYear.rates?.residential || {},
        });
      } else {
        setSelectedYear(null);
        setRates(EMPTY_RATES);
      }
    } catch (err) {
      console.error("Error loading power rate years:", err);

      setError(
        "Unable to load power rate years. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Select Year
  // --------------------------------------------------

  const handleSelectYear = (year) => {
    setSelectedYear(year);

    setRates({
      commercial: year.rates?.commercial || {},
      industrial: year.rates?.industrial || {},
      residential: year.rates?.residential || {},
    });

    setActiveRateClass("residential");

    setMessage("");
    setError("");
  };

  // --------------------------------------------------
  // Change Rate
  // --------------------------------------------------

  const handleRateChange = (month, value) => {
    setRates((previous) => ({
      ...previous,

      [activeRateClass]: {
        ...previous[activeRateClass],
        [month]: value,
      },
    }));

    setMessage("");
    setError("");
  };

  // --------------------------------------------------
  // Save ALL Rates
  // --------------------------------------------------

  const handleSaveRates = async () => {
    if (!selectedYear) {
      setError("No power rate year is selected.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      // ---------------------------------------------
      // Validate rates
      // ---------------------------------------------

      for (const rateClass of [
        "residential",
        "commercial",
        "industrial",
      ]) {
        for (const month of MONTHS) {
          const value = rates?.[rateClass]?.[month.number];

          // Allow blank / null values
          if (
            value === "" ||
            value === null ||
            value === undefined
          ) {
            continue;
          }

          const numericRate = Number(value);

          if (Number.isNaN(numericRate)) {
            setError(
              `${rateClass} ${month.name} must be a valid number.`
            );

            return;
          }

          if (numericRate < 0) {
            setError(
              `${rateClass} ${month.name} cannot be negative.`
            );

            return;
          }
        }
      }

      // ---------------------------------------------
      // Format rates before sending to Supabase
      // ---------------------------------------------

      const formattedRates = {
        residential: {},
        commercial: {},
        industrial: {},
      };

      for (const rateClass of [
        "residential",
        "commercial",
        "industrial",
      ]) {
        for (const month of MONTHS) {
          const value =
            rates?.[rateClass]?.[month.number];

          formattedRates[rateClass][month.number] =
            value === "" ||
            value === null ||
            value === undefined
              ? null
              : Number(value);
        }
      }

      // ---------------------------------------------
      // Update database
      // ---------------------------------------------

      const result = await updatePowerRateYear(
        selectedYear.id,
        selectedYear.year,
        selectedYear.pdf_url,
        formattedRates
      );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to update the power rates."
        );

        return;
      }

      // ---------------------------------------------
      // Update local state
      // ---------------------------------------------

      const updatedYear = {
        ...selectedYear,
        rates: formattedRates,
      };

      setSelectedYear(updatedYear);

      setYears((previous) =>
        previous
          .map((year) =>
            year.id === selectedYear.id
              ? updatedYear
              : year
          )
          .sort(
            (a, b) =>
              Number(b.year) - Number(a.year)
          )
      );

      setRates(formattedRates);

      setMessage(
        result.message ||
          "Power rates updated successfully."
      );
    } catch (err) {
      console.error(
        "Error saving power rates:",
        err
      );

      setError(
        "Unable to save the power rates. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Add New Year
  // --------------------------------------------------

  const handleAddYear = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const year = Number(yearForm.year);

    if (!yearForm.year || Number.isNaN(year)) {
      setError("Please enter a valid year.");
      return;
    }

    if (year < 2000 || year > 2100) {
      setError(
        "Please enter a year between 2000 and 2100."
      );
      return;
    }

    if (
      years.some(
        (item) => Number(item.year) === year
      )
    ) {
      setError("That year already exists.");
      return;
    }

    try {
      setSaving(true);

      const result = await createPowerRateYear(
        year,
        yearForm.pdf_url.trim() || null
      );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to create the year."
        );

        return;
      }

      const newYear = result.data;

      const updatedYears = [
        newYear,
        ...years,
      ].sort(
        (a, b) =>
          Number(b.year) - Number(a.year)
      );

      setYears(updatedYears);

      setSelectedYear(newYear);

      setRates({
        commercial:
          newYear.rates?.commercial || {},
        industrial:
          newYear.rates?.industrial || {},
        residential:
          newYear.rates?.residential || {},
      });

      setActiveRateClass("residential");

      setMessage(
        result.message ||
          `${year} created successfully.`
      );

      setYearForm({
        year: "",
        pdf_url: "",
      });

      setShowAddYear(false);
    } catch (err) {
      console.error(
        "Error creating power rate year:",
        err
      );

      setError(
        "Unable to create the year. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Open Edit Year
  // --------------------------------------------------

  const openEditYear = () => {
    if (!selectedYear) {
      return;
    }

    setYearForm({
      year: selectedYear.year,
      pdf_url: selectedYear.pdf_url || "",
    });

    setShowEditYear(true);

    setError("");
    setMessage("");
  };

  // --------------------------------------------------
  // Update Year Information
  // --------------------------------------------------

  const handleUpdateYear = async (e) => {
    e.preventDefault();

    if (!selectedYear) {
      setError("No year selected.");
      return;
    }

    setError("");
    setMessage("");

    const year = Number(yearForm.year);

    if (!yearForm.year || Number.isNaN(year)) {
      setError("Please enter a valid year.");
      return;
    }

    if (year < 2000 || year > 2100) {
      setError(
        "Please enter a year between 2000 and 2100."
      );
      return;
    }

    const duplicate = years.some(
      (item) =>
        Number(item.year) === year &&
        item.id !== selectedYear.id
    );

    if (duplicate) {
      setError("That year already exists.");
      return;
    }

    try {
      setSaving(true);

      const result = await updatePowerRateYear(
        selectedYear.id,
        year,
        yearForm.pdf_url.trim() || null,
        selectedYear.rates || rates
      );

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to update the year."
        );

        return;
      }

      const updatedYear = result.data;

      const updatedYears = years
        .map((item) =>
          item.id === updatedYear.id
            ? updatedYear
            : item
        )
        .sort(
          (a, b) =>
            Number(b.year) - Number(a.year)
        );

      setYears(updatedYears);

      setSelectedYear(updatedYear);

      setRates({
        commercial:
          updatedYear.rates?.commercial || {},
        industrial:
          updatedYear.rates?.industrial || {},
        residential:
          updatedYear.rates?.residential || {},
      });

      setShowEditYear(false);

      setMessage(
        result.message ||
          `${year} information updated successfully.`
      );
    } catch (err) {
      console.error(
        "Error updating power rate year:",
        err
      );

      setError(
        "Unable to update the year. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-semibold text-slate-500">
          Loading power rates...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      className="w-full"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="w-full">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
              Power Rate Management
            </p>

            <h1 className="mt-1 text-3xl font-extrabold text-slate-900">
              Manage Power Rates
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View, add, and update annual power rates.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setYearForm({
                year: "",
                pdf_url: "",
              });

              setError("");
              setMessage("");

              setShowAddYear(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600"
          >
            <FaPlus />
            Add Year
          </button>
        </div>

        {/* ========================================= */}
        {/* MESSAGES */}
        {/* ========================================= */}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ========================================= */}
        {/* MAIN CARD */}
        {/* ========================================= */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">

          {/* ======================================= */}
          {/* YEAR SELECTOR */}
          {/* ======================================= */}

          <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">

            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Select Year
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">

              {years.map((year) => {
                const active =
                  selectedYear?.id === year.id;

                return (
                  <button
                    key={year.id}
                    type="button"
                    onClick={() =>
                      handleSelectYear(year)
                    }
                    className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {year.year}
                  </button>
                );
              })}

            </div>
          </div>

          {/* ======================================= */}
          {/* SELECTED YEAR */}
          {/* ======================================= */}

          {selectedYear && (
            <>

              {/* =================================== */}
              {/* YEAR HEADER */}
              {/* =================================== */}

              <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-7">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  {/* Year information */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-600">
                      {selectedYear.year}
                    </p>

                    <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                      Power Rates
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Monthly rate summary in PHP per kWh.
                    </p>
                  </div>

                  {/* ================================= */}
                  {/* ACTION BUTTONS */}
                  {/* ================================= */}

                  <div className="flex flex-wrap gap-2">

                    {selectedYear.pdf_url && (
                      <a
                        href={selectedYear.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        <FaFilePdf className="text-red-500" />
                        View PDF
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={openEditYear}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                    >
                      <FaEdit />
                      Edit Year
                    </button>

                    {/* ================================= */}
                    {/* SINGLE SAVE BUTTON */}
                    {/* ================================= */}

                    <button
                      type="button"
                      onClick={handleSaveRates}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaSave />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>
                </div>
              </div>

              {/* =================================== */}
              {/* RATE CLASS TABS */}
              {/* =================================== */}

              <div className="border-b border-slate-200 bg-white px-5 sm:px-7">

                <div className="flex overflow-x-auto">

                  {RATE_CLASSES.map((rateClass) => {
                    const active =
                      activeRateClass ===
                      rateClass.id;

                    return (
                      <button
                        key={rateClass.id}
                        type="button"
                        onClick={() => {
                          setActiveRateClass(
                            rateClass.id
                          );

                          setMessage("");
                          setError("");
                        }}
                        className={`relative whitespace-nowrap px-6 py-4 text-sm font-bold transition ${
                          active
                            ? "text-amber-700"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {rateClass.label}

                        {active && (
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-amber-500" />
                        )}
                      </button>
                    );
                  })}

                </div>
              </div>

              {/* =================================== */}
              {/* TABLE */}
              {/* =================================== */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[650px] border-collapse">

                  <thead>
                    <tr className="bg-slate-900 text-white">

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                        Month
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider">
                        {RATE_CLASSES.find(
                          (item) =>
                            item.id ===
                            activeRateClass
                        )?.label}{" "}
                        Rate (PHP/kWh)
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {MONTHS.map((month, index) => {

                      const value =
                        rates?.[
                          activeRateClass
                        ]?.[month.number] ?? "";

                      return (
                        <tr
                          key={month.number}
                          className={`border-b border-slate-200 ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-slate-50/50"
                          }`}
                        >

                          {/* Month */}
                          <td className="px-5 py-4">

                            <div className="font-bold text-slate-800">
                              {month.name}
                            </div>

                            <div className="text-xs font-semibold text-slate-400">
                              {month.short}{" "}
                              {selectedYear.year}
                            </div>

                          </td>

                          {/* Rate */}
                          <td className="px-5 py-4">

                            <input
                              type="number"
                              step="0.0001"
                              min="0"
                              value={value}
                              placeholder="N/A"
                              onChange={(e) =>
                                handleRateChange(
                                  month.number,
                                  e.target.value
                                )
                              }
                              className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            />

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

              {/* =================================== */}
              {/* FOOTER */}
              {/* =================================== */}

              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-7">

                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                  <p className="text-xs font-medium text-slate-500">
                    Enter rates in PHP per kWh.
                    Blank months will remain
                    unavailable on the public rate
                    table.
                  </p>

                  <p className="text-xs font-semibold text-slate-400">
                    Changes are saved together.
                  </p>

                </div>

              </div>

            </>
          )}

          {/* ======================================= */}
          {/* NO YEARS */}
          {/* ======================================= */}

          {!selectedYear && (
            <div className="px-6 py-16 text-center">

              <h2 className="text-xl font-bold text-slate-800">
                No power rate years found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add your first power rate year to
                begin.
              </p>

            </div>
          )}

        </section>
      </div>

      {/* =========================================== */}
      {/* ADD YEAR MODAL */}
      {/* =========================================== */}

      {showAddYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Add Power Rate Year
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new year for power rates.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddYear(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleAddYear}>

              <div className="space-y-5">

                {/* Year */}
                <label className="block">

                  <span className="text-sm font-bold text-slate-700">
                    Year
                  </span>

                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={yearForm.year}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        year: e.target.value,
                      })
                    }
                    placeholder="2027"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    required
                  />

                </label>

                {/* PDF */}
                <label className="block">

                  <span className="text-sm font-bold text-slate-700">
                    PDF URL
                  </span>

                  <input
                    type="url"
                    value={yearForm.pdf_url}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        pdf_url: e.target.value,
                      })
                    }
                    placeholder="https://drive.google.com/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />

                </label>

              </div>

              <div className="mt-7 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddYear(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Create Year"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================== */}
      {/* EDIT YEAR MODAL */}
      {/* =========================================== */}

      {showEditYear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">

          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-extrabold text-slate-900">
                  Edit {selectedYear?.year}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update the year information or PDF
                  URL.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEditYear(false)
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <FaTimes />
              </button>

            </div>

            <form onSubmit={handleUpdateYear}>

              <div className="space-y-5">

                {/* Year */}
                <label className="block">

                  <span className="text-sm font-bold text-slate-700">
                    Year
                  </span>

                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={yearForm.year}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        year: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    required
                  />

                </label>

                {/* PDF */}
                <label className="block">

                  <span className="text-sm font-bold text-slate-700">
                    PDF URL
                  </span>

                  <input
                    type="url"
                    value={yearForm.pdf_url}
                    onChange={(e) =>
                      setYearForm({
                        ...yearForm,
                        pdf_url: e.target.value,
                      })
                    }
                    placeholder="https://drive.google.com/..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />

                </label>

              </div>

              <div className="mt-7 flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditYear(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default PowerRateManagement;