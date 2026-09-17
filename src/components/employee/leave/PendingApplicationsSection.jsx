import Pagination from "../../reusable/Pagination";
import { usePagedList } from "../../../hooks/usePagedList";
import { formatDate_Month_Day_Year } from "../../../utils/utils";

function PendingApplicationsSection({
  applications,
  processingCancel,
  onCancel,
}) {
  const { page, totalPages, paginated, goToPrevious, goToNext } =
    usePagedList(applications);

  if (applications.length === 0) return null;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        Pending Leave Applications ({applications.length})
      </h3>
      <div className="mt-4 space-y-3">
        {paginated.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="mt-2 flex text-sm">
                  <span className="text-sm text-slate-500">
                    {a.id} - {a.leave_type} -
                  </span>{" "}
                  - (
                  {a.approver_id_status?.map((approver, index) => (
                    <span key={approver.id}>
                      {index > 0 && (
                        <span className="mx-1 text-slate-400">|</span>
                      )}
                      <span
                        className={`font-semibold ${
                          approver.status === "approved"
                            ? "text-emerald-600"
                            : approver.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {approver.status.charAt(0).toUpperCase() +
                          approver.status.slice(1)}
                      </span>
                    </span>
                  ))}
                  )
                </div>
                <p className="font-semibold">
                  {formatDate_Month_Day_Year(a.start_date)} →{" "}
                  {formatDate_Month_Day_Year(a.end_date)} - (
                  {a.days_requested} {a.days_requested === 1 ? "day" : "days"})
                </p>
                <p className="mt-1 text-sm italic text-slate-600">
                  Leave Reason: {a.reason}
                </p>
              </div>
              <button
                type="button"
                disabled={processingCancel === a.id}
                onClick={() => onCancel(a.id)}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                {processingCancel === a.id ? "Processing..." : "Cancel"}
              </button>
            </div>
          </div>
        ))}
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

export default PendingApplicationsSection;
