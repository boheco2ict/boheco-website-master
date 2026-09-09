import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaHashtag,
  FaRoute,
  FaTachometerAlt,
  FaEnvelope,
  FaUser,
  FaBook,
} from "react-icons/fa";

import AccountNavigator from "./account_navigator";
import Ledger from "./ledger";

const ConsumerInformation = ({
  account,
  email,
  currentIndex,
  totalAccounts,
  onPrevious,
  onNext,
}) => {
  const [showLedger, setShowLedger] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* Consumer Information */}
          <div className="p-6 lg:col-span-4 lg:p-7">

            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Consumer Information
                </span>
              </div>

              {totalAccounts > 1 && (
                <AccountNavigator
                  currentIndex={currentIndex}
                  totalAccounts={totalAccounts}
                  onPrevious={onPrevious}
                  onNext={onNext}
                />
              )}
            </div>

            {/* Consumer Name + Status */}
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                {account?.ConsumerName || "—"}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                  account?.AccountStatus?.toUpperCase() === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {account?.AccountStatus || "—"}
              </span>
            </div>

            {/* Address */}
            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
              {account?.ConsumerAddress || "—"}
            </p>

            {/* View Ledger Button */}
            <button
              type="button"
              onClick={() => setShowLedger(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <FaBook className="text-xs" />
              View Ledger
            </button>
          </div>

          {/* Divider */}
          <div className="hidden lg:block">
            <div className="my-7 h-[calc(100%-56px)] w-px bg-slate-200" />
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-1 p-6 sm:grid-cols-2 lg:col-span-7 lg:p-7">

            <InfoItem
              icon={<FaHashtag />}
              label="Account Number"
              value={account?.AccountNumber}
            />

            <InfoItem
              icon={<FaRoute />}
              label="Route"
              value={account?.Route}
            />

            <InfoItem
              icon={<FaTachometerAlt />}
              label="Meter Number"
              value={account?.MeterNumber}
            />

            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Area"
              value={account?.Area}
            />

            <InfoItem
              icon={<FaEnvelope />}
              label="Email"
              value={email}
            />

            <InfoItem
              icon={<FaUser />}
              label="Consumer Type"
              value={account?.ConsumerType}
            />

          </div>
        </div>
      </div>

      {/* Ledger Popup */}
      <Ledger
        isOpen={showLedger}
        onClose={() => setShowLedger(false)}
        account={account}
      />
    </>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">

      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <span className="text-amber-500">
          {icon}
        </span>

        {label}
      </span>

      <span className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
        {value || "—"}
      </span>

    </div>
  );
};

export default ConsumerInformation;