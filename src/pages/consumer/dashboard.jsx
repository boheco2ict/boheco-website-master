import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getLedger } from "../../services/getservices";
import DashboardLoading from "../../components/dashboard/ui/DashboardLoading";
import { formatBillingMonth_Year, formatDate_Month_Day_Year } from "../../utils";
import {
  FaMapMarkerAlt,
  FaHashtag,
  FaRoute,
  FaTachometerAlt,
  FaEnvelope,
  FaUser,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaBolt,
  FaCalendarCheck
} from "react-icons/fa";

const Dashboard = () => {
  const { user: authUserInfo, consumerInfo, loading: authLoading } = useAuth();
  const [forDisplayData, setForDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLedger = async () => {
      if (authLoading || !consumerInfo) return;

      try {
        setLoading(true);
        const response = await getLedger(
          consumerInfo?.account_number,
          consumerInfo?.service_period_end,
          consumerInfo?.net_amount
        );

        if (response?.data?.[0]) {
          setForDisplayData(response.data[0]);
        } else {
          setForDisplayData([]);
        }
      } catch (err) {
        console.error("Fetch Ledger Error:", err);
        setForDisplayData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [authLoading, consumerInfo]);

  if (loading && authLoading) {
    return <DashboardLoading/>
  }

  return (
  <div className="m-5 space-y-5">

    {/* ============================= */}
    {/* Consumer Information */}
    {/* ============================= */}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* Consumer Information */}
        <div className="p-6 lg:col-span-4 lg:p-7">

          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Consumer Information
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {forDisplayData?.ConsumerName || "—"}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                forDisplayData?.AccountStatus?.toUpperCase() === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {forDisplayData?.AccountStatus || "—"}
            </span>
          </div>

          <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
            {forDisplayData?.ConsumerAddress || "—"}
          </p>
        </div>

        {/* Divider */}
        <div className="hidden lg:block">
          <div className="my-7 h-[calc(100%-56px)] w-px bg-slate-200" />
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-1 p-6 sm:grid-cols-2 lg:col-span-7 lg:p-7">

          {/* Account Number */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaHashtag className="text-amber-500" />
              Account Number
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {forDisplayData?.AccountNumber || "—"}
            </span>
          </div>

          {/* Route */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaRoute className="text-amber-500" />
              Route
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {forDisplayData?.Route || "—"}
            </span>
          </div>

          {/* Meter Number */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaTachometerAlt className="text-amber-500" />
              Meter Number
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {forDisplayData?.MeterNumber || "—"}
            </span>
          </div>

          {/* Area */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaMapMarkerAlt className="text-amber-500" />
              Area
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {forDisplayData?.Area || "—"}
            </span>
          </div>

          {/* Email */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaEnvelope className="text-amber-500" />
              Email
            </span>

            <span className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
              {loading ? "—" : authUserInfo?.email || "—"}
            </span>
          </div>

          {/* Consumer Type */}
          <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-slate-100 py-2">
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              <FaUser className="text-amber-500" />
              Consumer Type
            </span>

            <span className="text-sm font-semibold text-slate-800">
              {forDisplayData?.ConsumerType || "—"}
            </span>
          </div>

        </div>
      </div>
    </div>


    {/* ============================= */}
    {/* Latest Bill */}
    {/* ============================= */}
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
            forDisplayData?.BillStatus?.toUpperCase() === "PAID"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {forDisplayData?.BillStatus || "—"}
        </span>
      </div>


      {/* Bill Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

        {/* Billing Month */}
        <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FaCalendarAlt className="text-amber-500" />
            Billing Month
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatBillingMonth_Year(
              forDisplayData?.ServicePeriodEnd
            ) || "—"}
          </p>
        </div>


        {/* Due Date */}
        <div className="border-b border-slate-100 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FaCalendarCheck className="text-amber-500" />
            Due Date
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatDate_Month_Day_Year(
              forDisplayData?.DueDate
            ) || "—"}
          </p>
        </div>


        {/* kWh Used */}
        <div className="border-b border-slate-100 p-5 sm:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FaBolt className="text-amber-500" />
            kWh Used
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {forDisplayData?.PowerKWH || "—"}
          </p>
        </div>


        {/* Total Amount */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
            <FaMoneyBillWave className="text-amber-500" />
            Total Amount
          </div>

          <p className="mt-2 text-xl font-extrabold text-slate-900">
            ₱{forDisplayData?.NetAmount || "—"}
          </p>
        </div>

      </div>


      {/* Footer */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">

        <span className="text-xs text-slate-500">
          Bill No.{" "}
          <span className="font-semibold text-slate-700">
            {forDisplayData?.BillNumber || "—"}
          </span>
        </span>

        <span className="text-xs text-slate-500">
          Previous:{" "}
          <span className="font-semibold text-slate-700">
            {forDisplayData?.PowePreviousReading || "—"} kWh
          </span>

          {" → "}

          <span className="font-semibold text-slate-700">
            {forDisplayData?.PowerPresentReading || "—"} kWh
          </span>
        </span>

      </div>
    </div>

  </div>
);
};

export default Dashboard;