function LeaveBalancesGrid({ leaveCredits }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {leaveCredits.map((ledger, index) => (
        <div
          key={`${ledger.leave_type}-${index}`}
          className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">Leave Type</p>
            <p className="truncate text-lg font-bold text-slate-900">
              {ledger.leave_type || "Leave"}
            </p>
          </div>
          <div className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-lg bg-amber-50 text-center">
            <span className="text-xl font-bold text-slate-900">
              {ledger.leave_balance ?? 0}
            </span>
            <span className="text-xs font-medium text-amber-700">
              Balance
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LeaveBalancesGrid;
