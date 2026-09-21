import FormatDate from "../../reusable/FormatDate";

function OfficeOrderItem({ item, isMarking, onOpen, onMarkAsRead }) {
  return (
    <div
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
        {/* Office Order Information */}
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
              Office Order
            </span>
          </div>

          {/* Title */}
          <h4 className="mt-2 text-lg font-bold leading-snug themed-text">
            {item.title || "Untitled Office Order"}
          </h4>

          {/* Description */}
          {item.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 themed-muted">
              {item.description}
            </p>
          )}

          {/* Office Order Details */}
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
              onOpen(item);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 sm:w-auto"
          >
            <span>View Office Order</span>
            <span className="text-base">→</span>
          </button>

          {/* Mark as Read */}
          {!item.is_read && (
            <button
              type="button"
              disabled={isMarking}
              onClick={() => onMarkAsRead(item, 0)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <span>{isMarking ? "✓" : "✓"}</span>
              <span>{isMarking ? "Marking..." : "Mark as Read"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OfficeOrderItem;
