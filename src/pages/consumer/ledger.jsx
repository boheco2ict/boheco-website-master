import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { getLedger } from "../../services/getservices";
import { formatBillingMonth_Year, formatDate_Month_Day_Year } from "../../utils";
import Pagination from "../../components/Pagination";

const ConsumerLedger = () => {
  const { consumerInfo, loading: authLoading } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forDisplayData, setForDisplayData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  useEffect(() => {
      const fetchLedger = async () => {
      if (authLoading) return;

      try {
          setLoading(true);
          setError("");
          const response = await getLedger(consumerInfo?.account_number, consumerInfo?.service_period_end, consumerInfo?.net_amount);
          if (response?.data) {
            setForDisplayData(response.data[0]);
            setBills(response.data);
          } else {
            setForDisplayData([]);
            setBills([]);
          }
      } catch (err) {
          console.error("Fetch Ledger Error:", err);
          setError(err.message || "Failed to load ledger.");
      } finally {
          setLoading(false);
      }
      };

      fetchLedger();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  if (authLoading) {
    return null;
  }

  if (!bills) {
    return null;
  }

  if (!forDisplayData) {
    return null;
  }
  
  return (
    <div
      className="min-h-screen px-5 pb-6 pt-[21px]"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="w-full space-y-5">
        {/* =====================================================
            LEDGER
        ====================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Ledger Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">

            {/* Title */}
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FaFileAlt className="text-sm" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Ledger
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Billing history and payment records
                </p>
              </div>

            </div>


            {/* Year Filter */}
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
                className="
                  h-9
                  min-w-[120px]
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  text-sm
                  font-medium
                  text-slate-700
                  shadow-sm
                  outline-none
                  transition
                  hover:border-slate-300
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-200
                "
              >
                <option value="ALL">
                  All Years
                </option>

                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* =====================================================
              LOADING
          ====================================================== */}
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />

                <p className="text-sm font-medium text-slate-600">
                  Retrieving ledger data
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please wait...
                </p>

              </div>

            </div>
          )}


          {/* =====================================================
              ERROR
          ====================================================== */}
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


          {/* =====================================================
              EMPTY
          ====================================================== */}
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


          {/* =====================================================
              TABLE
          ====================================================== */}
          {!loading && !error && filteredBills.length > 0 && (
            <>

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px] border-collapse">

                  <thead>

                    <tr className="bg-slate-50">

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Bill Number
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Billing Month
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Due Date
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Previous kWh
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Present kWh
                      </th>

                      <th className="border-b border-r border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        kWh Used
                      </th>

                      <th className="border-b border-slate-200 px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Total Amount
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {paginatedBills.map((bill) => (

                      <tr
                        key={bill.BillNumber}
                        className="group transition-colors hover:bg-slate-50"
                      >

                        {/* Status */}
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


                        {/* Bill Number */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-semibold text-slate-700">
                          {bill.BillNumber || "—"}
                        </td>


                        {/* Billing Month */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-medium text-slate-700">
                          {formatBillingMonth_Year(bill.ServicePeriodEnd) || "—"}
                        </td>


                        {/* Due Date */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm text-slate-600">
                          {formatDate_Month_Day_Year(bill.DueDate) || "—"}
                        </td>


                        {/* Previous KWH */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm tabular-nums text-slate-600">
                          {bill.PowePreviousReading || "—"}
                        </td>


                        {/* Present KWH */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm tabular-nums text-slate-600">
                          {bill.PowerPresentReading || "—"}
                        </td>


                        {/* KWH Used */}
                        <td className="border-b border-r border-slate-100 px-5 py-4 text-sm font-medium tabular-nums text-slate-700">
                          {bill.PowerKWH || "—"}
                        </td>


                        {/* Total Amount */}
                        <td className="border-b border-slate-100 px-5 py-4 text-sm font-bold tabular-nums text-slate-900">
                          {bill.NetAmount || "—"}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>


              {/* Pagination */}
              <div className="px-5 pb-5">

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={() =>
                    setCurrentPage((page) =>
                      Math.max(page - 1, 1)
                    )
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

        </section>

      </div>
    </div>
  );
};

export default ConsumerLedger;