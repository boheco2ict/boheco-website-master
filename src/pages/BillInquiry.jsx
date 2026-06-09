import { useState } from "react";
import axios from "axios";
import {
  FaCalendarAlt,
  FaExclamationCircle,
  FaHashtag,
  FaReceipt,
  FaTimes,
} from "react-icons/fa";
import { extractBillDetails } from "../utils";

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

  const canSubmit =
    accountNumber.length === 10 && /^\d{2}-\d{4}$/.test(billMonth) && !loading;

  const formatMonthValue = (value) => {
    const raw = value.replace(/[^\d-]/g, "");
    const parts = raw.split("-");
    const monthPart = parts[0].slice(0, 2);
    const yearPart = parts.slice(1).join("").slice(0, 4);

    if (raw.includes("-")) {
      return `${monthPart}${monthPart || yearPart ? "-" : ""}${yearPart}`;
    }

    const digits = raw.slice(0, 6);
    if (digits.length <= 2) {
      return digits;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  };

  const handleInquiry = async (event) => {
    event.preventDefault();

    if (!canSubmit) return;

    setLoading(true);
    setServiceOnline(true);
    setBillingDetails({ error: null, data: null });

    const [month, year] = billMonth.split("-");
    const data = {
      AccountNumber: accountNumber,
      ServicePeriodEnd: `${month}/01/${year}`,
    };

    try {
      const response = await axios.post(process.env.REACT_APP_API_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const { error, data: extractedData } = extractBillDetails(response.data);
      setBillingDetails({ error, data: extractedData });
    } catch (error) {
      setServiceOnline(false);
      setBillingDetails({
        error: new Error("Something went wrong. Please try again later."),
        data: null,
      });
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  const clearForm = () => {
    setAccountNumber("");
    setBillMonth("");
    setBillingDetails({ error: null, data: null });
    setOpen(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen px-4 pb-12 pt-20 sm:px-6 lg:px-10">
      <main className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.3fr_0.95fr] lg:items-start">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
                Bill inquiry
              </span>

              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Retrieve your BOHECO II bill instantly
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  Enter your account number and billing month to see your amount due, due date, and billing status quickly.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-slate-950">Check your bill</h2>
                <ServiceBadge online={serviceOnline} />
              </div>

              <form onSubmit={handleInquiry} className="mt-4 space-y-4">
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
                      setAccountNumber(event.target.value.replace(/\D/g, "")),
                  }}
                />

                <InputField
                  icon={FaCalendarAlt}
                  label="Billing month"
                  helper="Use MM-YYYY format, for example 01-2026."
                  inputProps={{
                    type: "text",
                    inputMode: "numeric",
                    id: "billMonth",
                    name: "billMonth",
                    required: true,
                    maxLength: "7",
                    placeholder: "MM-YYYY",
                    value: billMonth,
                    disabled: loading,
                    onChange: (event) =>
                      setBillMonth(formatMonthValue(event.target.value)),
                  }}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
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

                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

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

function ServiceBadge({ online }) {
  return (
    <div
      className={`self-start inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${
        online ? "border-emerald-600 bg-emerald-600 text-white" : "border-red-600 bg-red-600 text-white"
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          online ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      Service {online ? "Online" : "Offline"}
    </div>
  );
}

function InputField({ icon: Icon, label, helper, inputProps }) {
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
      <p className="mt-2 text-xs text-slate-700">{helper}</p>
    </div>
  );
}

function ResultModal({ billingDetails, onClose, onNewInquiry }) {
  const hasError = Boolean(billingDetails.error);
  const data = billingDetails.data;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                hasError ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {hasError ? <FaExclamationCircle /> : <FaReceipt />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {hasError ? "Inquiry Result" : "Bill Details"}
              </h2>
              <p className="text-sm text-slate-500">
                {hasError ? "Please review the message below." : "Here is your bill summary."}
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

          <div className="p-4">
          {hasError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {billingDetails.error?.message || "No bill details were found."}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-3xl bg-slate-50 p-4 text-center">
                <p className="text-sm font-medium text-slate-500">Consumer Name</p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {data.consumerName || "N/A"}
                </p>
                <p className="mt-4 text-sm font-medium text-slate-500">Amount Due</p>
                <p className="text-2xl font-extrabold text-emerald-700">
                  {formatAmount(data.amount)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultItem label="Account No." value={data.accountNumber} />
                <ResultItem label="Reference No." value={data.referenceNumber} />
                <ResultItem label="Billing Month" value={data.billingMonth} />
                <ResultItem label="Due Date" value={data.dueDate} warning />
                <ResultItem label="kWh Used" value={data.kWhUsed} />
                <ResultItem label="Bill Status" value={data.billStatus} />
              </div>
            </div>
          )}
        </div>

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

function ResultItem({ label, value, warning }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`mt-2 text-sm font-bold ${
          warning ? "text-red-700" : "text-slate-900"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
}

function formatAmount(value) {
  const amount = Number(String(value).replace(/,/g, ""));

  if (!Number.isFinite(amount)) {
    return value ? `PHP ${value}` : "N/A";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

export default BillInquiry;
