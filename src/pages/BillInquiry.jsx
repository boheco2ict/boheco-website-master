import { useMemo, useState } from "react";
import axios from "axios";
import {
  FaBolt,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaHashtag,
  FaInfoCircle,
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

  const helperText = useMemo(() => {
    if (!accountNumber && !billMonth) {
      return "Enter your 10-digit account number and billing month.";
    }

    if (accountNumber.length > 0 && accountNumber.length < 10) {
      return "Account number must be 10 digits.";
    }

    if (billMonth.length > 0 && !/^\d{2}-\d{4}$/.test(billMonth)) {
      return "Billing month must follow MM-YYYY format.";
    }

    return "Ready to check your bill.";
  }, [accountNumber, billMonth]);

  const formatMonthValue = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);

    if (digits.length >= 2) {
      const month = digits.slice(0, 2);
      if (+month < 1 || +month > 12) return digits.slice(0, 1);
    }

    if (digits.length <= 2) return digits;
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
    <div className="bg-image2 min-h-screen px-4 pb-10 pt-28 sm:px-6 lg:px-10">
      <main className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[1fr_420px] lg:items-start">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white/95 shadow-sm backdrop-blur">
          <div className="border-b border-slate-200 bg-slate-900 px-5 py-3 text-white sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="w-fit rounded-md bg-amber-300 px-2.5 py-1 text-sm font-bold text-slate-950">
                Bill Inquiry
              </span>
              <ServiceBadge online={serviceOnline} />
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
              BOHECO II Online Service
            </p>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Check your latest bill details
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Use your account number and billing month to view the amount due,
              due date, bill status, and kWh usage.
            </p>

            <form onSubmit={handleInquiry} className="mt-6 space-y-5">
              <InputField
                icon={FaHashtag}
                label="Account Number"
                helper="Enter the 10-digit account number printed on your bill."
                inputProps={{
                  type: "text",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  id: "accountNumber",
                  name: "accountNumber",
                  required: true,
                  maxLength: "10",
                  placeholder: "Example: 1234567890",
                  value: accountNumber,
                  disabled: loading,
                  onChange: (event) =>
                    setAccountNumber(event.target.value.replace(/\D/g, "")),
                }}
              />

              <InputField
                icon={FaCalendarAlt}
                label="Billing Month"
                helper="Use month and year format, for example 01-2026."
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

              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-slate-700">
                <div className="flex gap-2">
                  <FaInfoCircle className="mt-0.5 flex-none text-amber-700" />
                  <span>{helperText}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-md bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Checking bill...
                    </>
                  ) : (
                    <>
                      <FaReceipt />
                      Check Bill
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  disabled={loading}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100 text-amber-700">
            <FaBolt size={22} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Before you search
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <HelpItem text="Use only numbers for your account number." />
            <HelpItem text="Billing month must be in MM-YYYY format." />
            <HelpItem text="If the service is offline, wait a moment and try again." />
          </div>
        </aside>
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
      className={`inline-flex w-fit items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
        online ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
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
        className="mb-2 block text-sm font-bold text-slate-800"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          {...inputProps}
          className="h-12 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 disabled:bg-slate-100"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function HelpItem({ text }) {
  return (
    <div className="flex gap-2">
      <FaCheckCircle className="mt-0.5 flex-none text-emerald-600" />
      <span>{text}</span>
    </div>
  );
}

function ResultModal({ billingDetails, onClose, onNewInquiry }) {
  const hasError = Boolean(billingDetails.error);
  const data = billingDetails.data;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-md ${
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
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            aria-label="Close result"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5">
          {hasError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {billingDetails.error?.message || "No bill details were found."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4 text-center">
                <p className="text-sm font-medium text-slate-500">Consumer Name</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {data.consumerName || "N/A"}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Amount Due
                </p>
                <p className="text-3xl font-extrabold text-emerald-700">
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
            className="rounded-md bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            New Inquiry
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
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
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={`mt-1 break-words text-sm font-bold ${
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
