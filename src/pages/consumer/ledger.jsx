import { useEffect, useState } from "react";
import {
  FaFileAlt,
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBolt,
} from "react-icons/fa";
import { getLedger } from "../../services/getservices";
import {
  formatBillingMonth_Year,
  formatDate_Month_Day_Year,
} from "../../utils";
import Pagination from "../../components/Pagination";

const ConsumerLedger = ({ isOpen, onClose, account }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBill, setSelectedBill] = useState(null);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchLedger = async () => {
      if (!isOpen) return;
      if (!account) return;
      
      try {
        setLoading(true);
        setError("");
        setBills([]);
        setSelectedYear("ALL");
        setCurrentPage(1);

        const response = await getLedger(account.AccountNumber, account.ServicePeriodEnd, account.NetAmount);

        if (response?.data) {
          setBills(response.data);
        } else {
          setBills([]);
        }
      } catch (err) {
        console.error("Fetch Ledger Error:", err);
        setError(err?.message || "Failed to load ledger.");
        setBills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [isOpen, account]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (selectedBill) {
        setSelectedBill(null);
      } else if (isOpen) {
        onClose?.();
      }
    };

    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, selectedBill, onClose]);

  useEffect(() => {
    if (!isOpen) setSelectedBill(null);
  }, [isOpen]);

  const filteredBills =
    selectedYear === "ALL"
      ? bills
      : bills.filter((bill) => {
          if (!bill.ServicePeriodEnd) return false;
          return (
            new Date(bill.ServicePeriodEnd)
              .getUTCFullYear()
              .toString() === selectedYear
          );
        });

  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const availableYears = [
    ...new Set(
      bills
        .filter((bill) => bill.ServicePeriodEnd)
        .map((bill) =>
          new Date(bill.ServicePeriodEnd).getUTCFullYear()
        )
    ),
  ].sort((a, b) => b - a);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ledger Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <FaFileAlt className="text-sm" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">My Ledger - {account?.AccountNumber || "N/A"}</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Billing history and payment records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {account?.account_number && (
              <div className="hidden text-right sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Account Number
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {account.account_number}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label
                htmlFor="billing-year"
                className="text-xs font-semibold uppercase tracking-wide text-slate-400"
              >
                Year
              </label>

              <select
                id="billing-year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 min-w-[120px] rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="ALL">All Years</option>
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close ledger"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
                  <p className="mt-1 text-xs text-slate-400">
                    Please wait...
                  </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="p-5">
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to retrieve ledger
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && filteredBills.length === 0 && (
            <div className="flex min-h-[280px] items-center justify-center px-5">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <FaFileAlt />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No ledger records found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {selectedYear === "ALL"
                    ? "There are currently no billing records available."
                    : `There are no billing records for ${selectedYear}.`}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && filteredBills.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      {[
                        "Status",
                        "Bill Number",
                        "Billing Month",
                        "Due Date",
                        "Previous kWh",
                        "Present kWh",
                        "kWh Used",
                        "Total Amount",
                      ].map((heading, index) => (
                        <th
                          key={heading}
                          className={`border-b border-slate-200 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${
                            index === 0 ? "text-center" : "text-left"
                          } ${index < 7 ? "border-r" : ""}`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedBills.map((bill) => (
                      <tr
                        key={bill.BillNumber}
                        onClick={() => setSelectedBill(bill)}
                        className="group cursor-pointer transition-colors hover:bg-slate-50"
                      >
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-center">
                          <span
                            className={`inline-flex min-w-[58px] items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              bill.BillStatus?.toUpperCase() === "PAID"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {bill.BillStatus || "—"}
                          </span>
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                          {bill.BillNumber || "—"}
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-medium text-slate-700">
                          {formatBillingMonth_Year(bill.ServicePeriodEnd) || "—"}
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm text-slate-600">
                          {formatDate_Month_Day_Year(bill.DueDate) || "—"}
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm tabular-nums text-slate-600">
                          {bill.PowePreviousReading || "—"}
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm tabular-nums text-slate-600">
                          {bill.PowerPresentReading || "—"}
                        </td>

                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-medium tabular-nums text-slate-700">
                          {bill.PowerKWH || "—"}
                        </td>

                        <td className="border-b border-slate-100 px-5 py-4 text-sm font-bold tabular-nums text-slate-900">
                          {bill.NetAmount || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-5 pb-5 pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  onNext={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bill Details Modal */}
      {selectedBill && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onClick={() => setSelectedBill(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <FaFileAlt />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Bill Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedBill.BillNumber || "Bill information"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div className="mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Billing Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedBill.BillStatus || "—"}
                  </p>
                </div>

                <span
                  className={`inline-flex min-w-[70px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold uppercase ${
                    selectedBill.BillStatus?.toUpperCase() === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedBill.BillStatus || "—"}
                </span>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-sm text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Billing Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DetailItem label="Bill Number" value={selectedBill.BillNumber} />
                  <DetailItem
                    label="Billing Month"
                    value={formatBillingMonth_Year(selectedBill.ServicePeriodEnd)}
                  />
                  <DetailItem
                    label="Due Date"
                    value={formatDate_Month_Day_Year(selectedBill.DueDate)}
                  />
                  <DetailItem
                    label="Service Period End"
                    value={formatDate_Month_Day_Year(selectedBill.ServicePeriodEnd)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <FaBolt className="text-sm text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Power Consumption
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <DetailItem
                    label="Previous Reading"
                    value={selectedBill.PowePreviousReading}
                    suffix=" kWh"
                  />
                  <DetailItem
                    label="Present Reading"
                    value={selectedBill.PowerPresentReading}
                    suffix=" kWh"
                  />
                  <DetailItem
                    label="Power Used"
                    value={selectedBill.PowerKWH}
                    suffix=" kWh"
                  />
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-sm text-slate-400" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Payment Information
                  </h3>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Total Amount
                  </p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                    ₱ {selectedBill.NetAmount || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, suffix = "" }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 text-sm font-semibold text-slate-700">
      {value !== undefined && value !== null && value !== ""
        ? `${value}${suffix}`
        : "—"}
    </p>
  </div>
);

export default ConsumerLedger;