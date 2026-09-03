import { useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaHashtag,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";

const AccountBillCard = ({ accounts = [], email = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!accounts.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
        No account information available.
      </div>
    );
  }

  const account = accounts[currentIndex];

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < accounts.length - 1;

  const previousAccount = () => {
    if (hasPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const nextAccount = () => {
    if (hasNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMonth = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "—";
    }

    return `₱${Number(amount).toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* =========================
          CONSUMER INFORMATION
      ========================== */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Consumer Information
            </span>
          </div>

          {/* Account counter */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previousAccount}
              disabled={!hasPrevious}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                hasPrevious
                  ? "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
              }`}
              title="Previous account"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <span className="min-w-[60px] text-center text-xs font-medium text-gray-500">
              {currentIndex + 1} / {accounts.length}
            </span>

            <button
              type="button"
              onClick={nextAccount}
              disabled={!hasNext}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                hasNext
                  ? "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
              }`}
              title="Next account"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Consumer name */}
          <div className="lg:border-r lg:border-gray-200 lg:pr-6">
            <div className="flex items-center gap-2">
              <FaUser className="text-orange-400" />

              <span className="text-xs uppercase text-gray-400">
                Consumer
              </span>
            </div>

            <p className="mt-2 text-lg font-semibold text-gray-800">
              {account.ConsumerName || "—"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {account.ConsumerAddress || "—"}
            </p>
          </div>

          {/* Account details */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 lg:col-span-2">

            <InfoItem
              icon={<FaHashtag />}
              label="Account Number"
              value={account.AccountNumber}
            />

            <InfoItem
              icon={<FaHashtag />}
              label="Route"
              value={account.Route}
            />

            <InfoItem
              icon={<FaTachometerAlt />}
              label="Meter Number"
              value={account.MeterNumber}
            />

            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Area"
              value={account.Area}
            />

            <InfoItem
              icon={<FaEnvelope />}
              label="Email"
              value={email}
            />

            <InfoItem
              icon={<FaUser />}
              label="Consumer Type"
              value={account.ConsumerType}
            />

          </div>
        </div>
      </div>

      {/* =========================
          LATEST BILL
      ========================== */}
      <div className="border-t border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <FaMoneyBillWave className="text-orange-500" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                Latest Bill
              </h2>

              <p className="text-xs text-gray-400">
                Your most recent billing information
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              account.BillStatus === "PAID"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {account.BillStatus || "—"}
          </span>
        </div>

        {/* Bill information */}
        <div className="grid grid-cols-2 border-t border-gray-200 md:grid-cols-4">

          <BillItem
            icon={<FaCalendarAlt />}
            label="Billing Month"
            value={formatMonth(account.ServicePeriodEnd)}
          />

          <BillItem
            icon={<FaCalendarAlt />}
            label="Due Date"
            value={formatDate(account.DueDate)}
          />

          <BillItem
            icon={<FaBolt />}
            label="KWH Used"
            value={
              account.PowerKWH !== null &&
              account.PowerKWH !== undefined
                ? `${account.PowerKWH} kWh`
                : "—"
            }
          />

          <BillItem
            icon={<FaMoneyBillWave />}
            label="Total Amount"
            value={formatAmount(account.NetAmount)}
            large
          />

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3 text-xs text-gray-400">

          <span>
            Bill No.{" "}
            <span className="font-medium text-gray-600">
              {account.BillNumber?.trim() || "—"}
            </span>
          </span>

          <span>
            Previous:{" "}
            <span className="font-medium text-gray-600">
              {account.PowePreviousReading ?? "—"} kWh
            </span>

            <span className="mx-1">→</span>

            <span className="font-medium text-gray-600">
              {account.PowerPresentReading ?? "—"} kWh
            </span>
          </span>

        </div>
      </div>
    </div>
  );
};


/* =========================
   SMALL COMPONENTS
========================= */

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="border-b border-gray-100 pb-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-orange-400">
          {icon}
        </span>

        <span className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-gray-700">
        {value || "—"}
      </p>
    </div>
  );
};


const BillItem = ({ icon, label, value, large }) => {
  return (
    <div className="border-r border-gray-200 px-6 py-4 last:border-r-0">

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-orange-500">
          {icon}
        </span>

        <span className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 font-medium ${
          large
            ? "text-xl font-bold text-gray-800"
            : "text-sm text-gray-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AccountBillCard;