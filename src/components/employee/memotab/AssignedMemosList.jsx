import { FaRegFileAlt } from "react-icons/fa";
import EmptyState from "../../reusable/EmptyState";
import FormatDate from "../../reusable/FormatDate";
import Pagination from "../../reusable/Pagination";

function AssignedMemosList({
  memos,
  currentMemos,
  isLoading,
  markingMemoId,
  currentPage,
  totalPages,
  onOpenMemo,
  onMarkAsRead,
  onPrevious,
  onNext,
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Assigned Memos</h3>
          <p className="text-sm text-slate-600">View memos assigned to you here.</p>
        </div>

        {isLoading && (
          <span className="text-sm text-slate-500">Loading memos…</span>
        )}
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : memos?.length > 0 ? (
        <div className="mt-6 space-y-4">
          {currentMemos.map((item) => (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${
                item.is_read
                  ? "border-slate-200 bg-white"
                  : "border-amber-300 bg-amber-50/60"
              }`}
            >
              {/* Unread indicator */}
              {!item.is_read && (
                <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
              )}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                {/* Memo Information */}
                <div className="min-w-0 flex-1">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    {!item.is_read && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        New
                      </span>
                    )}

                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Memorandum
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="mt-2 text-lg font-bold leading-snug themed-text">
                    {item.title || "Untitled Memo"}
                  </h4>

                  {/* Description */}
                  {item.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 themed-muted">
                      {item.description}
                    </p>
                  )}

                  {/* Memo Details */}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {/* Posted Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <span className="text-sm">📅</span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Posted
                        </p>

                        <p className="mt-0.5 text-sm font-medium themed-muted">
                          {FormatDate(item.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Posted By */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <span className="text-sm">👤</span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Posted By
                        </p>

                        <p className="mt-0.5 truncate text-sm font-medium themed-muted">
                          {item.postedBy
                            ? `${item.postedBy.firstname} ${
                                item.postedBy.middlename
                                  ? `${item.postedBy.middlename
                                      .charAt(0)
                                      .toUpperCase()}. `
                                  : ""
                              }${item.postedBy.lastname}`
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenMemo(item);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 sm:w-auto"
                  >
                    <span>View Memo</span>
                    <span className="text-base">→</span>
                  </button>

                  {/* Mark as Read */}
                  {!item.is_read && (
                    <button
                      type="button"
                      disabled={markingMemoId === item.id}
                      onClick={() => onMarkAsRead(item, 0)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      <span>{markingMemoId === item.id ? "✓" : "✓"}</span>

                      <span>
                        {markingMemoId === item.id ? "Marking..." : "Mark as Read"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      ) : (
        <EmptyState
          icon={FaRegFileAlt}
          title="No memos assigned"
          message="Memos sent to you will appear here."
        />
      )}
    </div>
  );
}

export default AssignedMemosList;
