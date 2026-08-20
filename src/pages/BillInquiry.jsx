import { useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaExclamationCircle,
  FaHashtag,
  FaReceipt,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { extractBillDetails } from "../utils";

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const YEARS = Array.from(
  { length: 10 },
  (_, index) => new Date().getFullYear() - index
);

const BillInquiry = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [billMonth, setBillMonth] = useState("");

  const [billingDetails, setBillingDetails] = useState({
    error: null,
    data: null,
  });

  const [open, setOpen] = useState(false);
  const [serviceOnline, setServiceOnline] = useState(true);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // FORM VALIDATION
  // =========================================================

  const canSubmit =
    accountNumber.length === 10 &&
    /^\d{2}-\d{4}$/.test(billMonth) &&
    !loading;

  // =========================================================
  // BILL INQUIRY
  // =========================================================

  const handleInquiry = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setLoading(true);
    setServiceOnline(true);
    setBillingDetails({
      error: null,
      data: null,
    });

    const [month, year] = billMonth.split("-");

    const data = {
      AccountNumber: accountNumber,
      ServicePeriodEnd: `${month}/01/${year}`,
    };

    console.log("inquiry input", data);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const {
        error,
        data: extractedData,
      } = extractBillDetails(response.data);

      setBillingDetails({
        error,
        data: extractedData,
      });
    } catch (error) {
      setServiceOnline(false);

      setBillingDetails({
        error: new Error(
          "Something went wrong. Please try again later."
        ),
        data: null,
      });
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {
    setAccountNumber("");
    setBillMonth("");

    setBillingDetails({
      error: null,
      data: null,
    });

    setOpen(false);
  };

  // =========================================================
  // BILLING MONTH HANDLERS
  // =========================================================

  const selectedMonth = billMonth
    ? billMonth.split("-")[0]
    : "";

  const selectedYear = billMonth
    ? billMonth.split("-")[1]
    : "";

  const handleMonthChange = (event) => {
    const month = event.target.value;

    if (!month) {
      setBillMonth("");
      return;
    }

    if (selectedYear) {
      setBillMonth(`${month}-${selectedYear}`);
    } else {
      setBillMonth(`${month}-`);
    }
  };

  const handleYearChange = (event) => {
    const year = event.target.value;

    if (!year) {
      setBillMonth("");
      return;
    }

    if (selectedMonth) {
      setBillMonth(`${selectedMonth}-${year}`);
    } else {
      setBillMonth(`-${year}`);
    }
  };

  const selectedMonthName = MONTHS.find(
    (month) => month.value === selectedMonth
  )?.label;

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-20 sm:px-6 lg:px-10">
      <main className="mx-auto max-w-4xl">

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.08)]">

          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

            {/* =================================================
                LEFT INFORMATION PANEL
            ================================================= */}

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-10 sm:px-10 lg:px-12 lg:py-12">

              {/* Decorative background */}

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="relative">

                {/* Badge */}

                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  <FaReceipt />
                  Bill Inquiry
                </span>

                {/* Heading */}

                <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.65rem]">
                  Retrieve your
                  <span className="block text-amber-400">
                    BOHECO II bill
                  </span>
                  instantly.
                </h1>

                {/* Description */}

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Enter your account number and
                  billing month to see your amount
                  due, due date, and billing status
                  quickly.
                </p>

                {/* =================================================
                    INFORMATION CARDS
                ================================================= */}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">

                  {/* Account Number */}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                      <FaHashtag />
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Account Number
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      10-digit account ID
                    </p>

                  </div>

                  {/* Billing Period */}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">

                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                      <FaCalendarAlt />
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Billing Period
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Month & Year
                    </p>

                  </div>

                </div>

              </div>
            </div>

            {/* =================================================
                RIGHT FORM PANEL
            ================================================= */}

            <div className="bg-white px-6 py-8 sm:px-8 lg:px-9 lg:py-10">

              {/* Header */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
                    Online Service
                  </p>

                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                    Check your bill
                  </h2>

                </div>

                <ServiceBadge
                  online={serviceOnline}
                />

              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleInquiry}
                className="mt-7 space-y-5"
              >

                {/* =================================================
                    ACCOUNT NUMBER
                ================================================= */}

                <InputField
                  icon={FaHashtag}
                  label="Account number"
                  helper="Enter the 10-digit account number printed on your bill."
                  inputProps={{
                    type: "text",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    id: "accountNumber",
                    name: "accountNumber",
                    required: true,
                    maxLength: "10",
                    placeholder: "1234567890",
                    value: accountNumber,
                    disabled: loading,
                    onChange: (event) =>
                      setAccountNumber(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      ),
                  }}
                />

                {/* =================================================
                    BILLING PERIOD
                ================================================= */}

                <div>

                  {/* Label */}

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <FaCalendarAlt className="text-sm" />
                    </div>

                    <div>

                      <label
                        htmlFor="billMonthSelect"
                        className="block text-sm font-bold text-slate-800"
                      >
                        Billing period
                      </label>

                      <p className="text-xs text-slate-500">
                        Select the month and year of
                        your bill.
                      </p>

                    </div>

                  </div>

                  {/* Month + Year */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* =================================================
                        MONTH DROPDOWN
                    ================================================= */}

                    <div>

                      <label
                        htmlFor="billMonthSelect"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
                      >
                        Month
                      </label>

                      <div className="relative">

                        <select
                          id="billMonthSelect"
                          name="billMonthSelect"
                          required
                          disabled={loading}
                          value={selectedMonth}
                          onChange={handleMonthChange}
                          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >

                          <option value="">
                            Select month
                          </option>

                          {MONTHS.map(
                            (month) => (
                              <option
                                key={
                                  month.value
                                }
                                value={
                                  month.value
                                }
                              >
                                {month.label}
                              </option>
                            )
                          )}

                        </select>

                        <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                      </div>

                    </div>

                    {/* =================================================
                        YEAR DROPDOWN
                    ================================================= */}

                    <div>

                      <label
                        htmlFor="billYearSelect"
                        className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500"
                      >
                        Year
                      </label>

                      <div className="relative">

                        <select
                          id="billYearSelect"
                          name="billYearSelect"
                          required
                          disabled={loading}
                          value={selectedYear}
                          onChange={handleYearChange}
                          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >

                          <option value="">
                            Select year
                          </option>

                          {YEARS.map(
                            (year) => (
                              <option
                                key={year}
                                value={year}
                              >
                                {year}
                              </option>
                            )
                          )}

                        </select>

                        <FaChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400" />

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      SELECTED BILLING PERIOD
                  ================================================= */}

                  {selectedMonth &&
                    selectedYear && (

                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-800">

                        <FaCalendarAlt />

                        <span>
                          Selected billing period:
                        </span>

                        <span className="font-bold">
                          {selectedMonthName}{" "}
                          {selectedYear}
                        </span>

                      </div>

                    )}

                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="grid gap-3 pt-1 sm:grid-cols-2">

                  {/* CHECK BILL */}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-amber-200/60 transition hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                  >

                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                        Checking bill...
                      </>
                    ) : (
                      <>
                        <FaReceipt />

                        Check bill
                      </>
                    )}

                  </button>

                  {/* CLEAR */}

                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="inline-flex min-h-[50px] w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Clear
                  </button>

                </div>

              </form>

            </div>

          </div>

        </section>

      </main>

      {/* =======================================================
          RESULT MODAL
      ======================================================= */}

      {open && (
        <ResultModal
          billingDetails={billingDetails}
          onClose={() => setOpen(false)}
          onNewInquiry={clearForm}
        />
      )}

    </div>
  );
};

// =============================================================
// SERVICE STATUS BADGE
// =============================================================

function ServiceBadge({ online }) {
  return (
    <div
      className={`inline-flex w-fit items-center gap-2 self-start rounded-full border px-3 py-2 text-sm font-semibold ${
        online
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          online
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />

      Service {online ? "Online" : "Offline"}
    </div>
  );
}

// =============================================================
// INPUT FIELD
// =============================================================

function InputField({
  icon: Icon,
  label,
  helper,
  inputProps,
}) {
  return (
    <div>

      <label
        htmlFor={inputProps.id}
        className="mb-2 block text-sm font-semibold text-slate-900"
      >
        {label}
      </label>

      <div className="relative">

        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

        <input
          {...inputProps}
          className="h-11 w-full rounded-2xl border border-slate-300 bg-slate-100 pl-11 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:bg-slate-100"
        />

      </div>

      <p className="mt-2 text-xs text-slate-700">
        {helper}
      </p>

    </div>
  );
}

// =============================================================
// RESULT MODAL
// =============================================================

function ResultModal({
  billingDetails,
  onClose,
  onNewInquiry,
}) {
  const hasError = Boolean(
    billingDetails.error
  );

  const data = billingDetails.data;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4"
    >

      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="max-h-[calc(100vh-3.5rem)] w-full max-w-full overflow-y-auto rounded-[2rem] bg-white shadow-2xl sm:max-w-lg"
      >

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-3">

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                hasError
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {hasError ? (
                <FaExclamationCircle />
              ) : (
                <FaReceipt />
              )}
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                {hasError
                  ? "Inquiry Result"
                  : "Bill Details"}
              </h2>

              <p className="text-sm text-slate-500">
                {hasError
                  ? "Please review the message below."
                  : "Here is your bill summary."}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Close result"
          >
            <FaTimes />
          </button>

        </div>

        {/* Content */}

        <div className="p-4">

          {hasError ? (

            <div className="rounded-3xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {billingDetails.error?.message ||
                "No bill details were found."}
            </div>

          ) : (

            <div className="space-y-5">

              <div className="rounded-3xl bg-slate-50 p-4 text-center">

                <p className="text-sm font-medium text-slate-500">
                  Consumer Name
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {data?.consumerName ||
                    "N/A"}
                </p>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Amount Due
                </p>

                <p className="text-2xl font-extrabold text-emerald-700">
                  {formatAmount(
                    data?.amount
                  )}
                </p>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                <ResultItem
                  label="Account No."
                  value={
                    data?.accountNumber
                  }
                />

                <ResultItem
                  label="Reference No."
                  value={
                    data?.referenceNumber
                  }
                />

                <ResultItem
                  label="Billing Month"
                  value={
                    data?.billingMonth
                  }
                />

                <ResultItem
                  label="Due Date"
                  value={data?.dueDate}
                  warning
                />

                <ResultItem
                  label="kWh Used"
                  value={data?.kWhUsed}
                />

                <ResultItem
                  label="Bill Status"
                  value={
                    data?.billStatus
                  }
                />

              </div>

            </div>

          )}

        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onNewInquiry}
            className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            New Inquiry
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

// =============================================================
// RESULT ITEM
// =============================================================

function ResultItem({
  label,
  value,
  warning,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">

      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-bold ${
          warning
            ? "text-red-700"
            : "text-slate-900"
        }`}
      >
        {value === undefined ||
        value === null
          ? "N/A"
          : String(value)}
      </p>

    </div>
  );
}

// =============================================================
// FORMAT AMOUNT
// =============================================================

function formatAmount(value) {
  const amount = Number(
    String(value ?? "").replace(/,/g, "")
  );

  if (!Number.isFinite(amount)) {
    return value
      ? `PHP ${value}`
      : "N/A";
  }

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
    }
  ).format(amount);
}

export default BillInquiry;