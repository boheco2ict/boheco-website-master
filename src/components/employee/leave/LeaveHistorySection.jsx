import { useState } from "react";
import Pagination from "../../reusable/Pagination";
import { usePagedList } from "../../../hooks/usePagedList";
import { formatDate_Month_Day_Year } from "../../../utils/utils";

function LeaveHistorySection({ applications }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter((app) => app.status === statusFilter);

  const { page, setPage, totalPages, paginated, goToPrevious, goToNext } =
    usePagedList(filtered);

  if (applications.length === 0) return null;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Leave Application History ({filtered.length})
        </h3>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="text-sm font-medium text-slate-600">
              No applications found.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              There are no {statusFilter === "all" ? "" : statusFilter} leave
              applications to display.
            </p>
          </div>
        ) : (
          paginated.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {a.id} - {a.leave_type}
                  </p>
                  <p className="font-semibold">
                    {formatDate_Month_Day_Year(a.start_date)} →{" "}
                    {formatDate_Month_Day_Year(a.end_date)} - (
                    {a.days_requested}{" "}
                    {a.days_requested === 1 ? "day" : "days"})
                  </p>
                  <p className="mt-1 text-sm italic text-slate-600">
                    Leave Reason: {a.reason}
                    <br />
                    {a.status === "rejected"
                      ? `Rejection Reason: ${a.rejection_reason}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    a.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : a.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : a.status === "cancelled"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
}

export default LeaveHistorySection;
