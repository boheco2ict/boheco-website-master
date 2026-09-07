import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaBolt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";

import {
  formatBillingMonth_Year,
  formatDate_Month_Day_Year,
} from "../../utils";

const LatestBill = ({ account }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FaFileInvoiceDollar className="text-lg" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Latest Bill
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Your most recent billing information
            </p>
          </div>

        </div>

        {/* Status */}
        <span
          className={`w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
            account?.BillStatus?.toUpperCase() === "PAID"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {account?.BillStatus || "—"}
        </span>

      </div>

      {/* Bill Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        <BillItem
          icon={<FaCalendarAlt />}
          label="Billing Month"
          value={
            formatBillingMonth_Year(
              account?.ServicePeriodEnd
            ) || "—"
          }
        />

        <BillItem
          icon={<FaCalendarCheck />}
          label="Due Date"
          value={
            formatDate_Month_Day_Year(
              account?.DueDate
            ) || "—"
          }
        />

        <BillItem
          icon={<FaBolt />}
          label="kWh Used"
          value={
            account?.PowerKWH !== null &&
            account?.PowerKWH !== undefined
              ? `${account.PowerKWH} kWh`
              : "—"
          }
        />

        <BillItem
          icon={<FaMoneyBillWave />}
          label="Total Amount"
          value={
            account?.NetAmount !== null &&
            account?.NetAmount !== undefined
              ? `₱${Number(account.NetAmount).toLocaleString(
                  "en-PH",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}`
              : "—"
          }
          large
        />

      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">

        <span className="text-xs text-slate-500">
          Bill No.{" "}
          <span className="font-semibold text-slate-700">
            {account?.BillNumber?.trim() || "—"}
          </span>
        </span>

        <span className="text-xs text-slate-500">

          Previous:{" "}

          <span className="font-semibold text-slate-700">
            {account?.PowePreviousReading ?? "—"} kWh
          </span>

          {" → "}

          <span className="font-semibold text-slate-700">
            {account?.PowerPresentReading ?? "—"} kWh
          </span>

        </span>

      </div>

    </div>
  );
};

const BillItem = ({ icon, label, value, large }) => {
  return (
    <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">

      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="text-amber-500">
          {icon}
        </span>

        {label}
      </div>

      <p
        className={`mt-2 ${
          large
            ? "text-xl font-extrabold text-slate-900"
            : "text-sm font-semibold text-slate-800"
        }`}
      >
        {value}
      </p>

    </div>
  );
};

export default LatestBill;