import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";

function ApplyLeaveModal({
  leaveCredits,
  approverName,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [applicationType, setApplicationType] = useState(
    leaveCredits[0]?.leave_type || ""
  );
  const [appStart, setAppStart] = useState("");
  const [appEnd, setAppEnd] = useState("");
  const [appReason, setAppReason] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [daysRequested, setDaysRequested] = useState(1);
  const [appError, setAppError] = useState("");
  const [appSuccess, setAppSuccess] = useState("");

  useEffect(() => {
    if (!appStart || !appEnd) {
      setDaysRequested("");
      return;
    }

    const start = new Date(appStart);
    const end = new Date(appEnd);

    if (end < start) {
      setDaysRequested("");
      return;
    }

    let workingDays = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      // Monday-Friday
      if (day >= 1 && day <= 5) {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    setDaysRequested(isHalfDay ? workingDays - 0.5 : workingDays);
  }, [appStart, appEnd, isHalfDay]);

  const validateApplication = useCallback(() => {
    setAppError("");
    if (!applicationType) return "Please choose a leave type.";
    if (!appStart) return "Please choose a start date.";
    if (!appEnd) return "Please choose an end date.";
    if (new Date(appStart) > new Date(appEnd))
      return "Start date cannot be after end date.";
    if (!appReason.trim()) return "Please provide a reason for your leave.";
    const dr = Number(daysRequested);
    if (!Number.isFinite(dr) || dr <= 0)
      return "Please enter a valid number of days.";
    return "";
  }, [applicationType, appStart, appEnd, appReason, daysRequested]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const availableBalance = leaveCredits.find(
        (l) =>
          String(l.leave_type).trim().toLowerCase() ===
          String(applicationType).trim().toLowerCase()
      )?.leave_balance;

      if (
        availableBalance !== undefined &&
        Number(daysRequested) > Number(availableBalance)
      ) {
        alert(
          `Insufficient Leave Balance. You have ${availableBalance} days available for ${applicationType}.`
        );
        return;
      }

      const validationMessage = validateApplication();
      if (validationMessage) {
        alert(validationMessage);
        return;
      }

      await onSubmit({
        leave_type: applicationType,
        start_date: appStart,
        end_date: appEnd,
        days_requested: Number(daysRequested),
        reason: appReason.trim(),
      });
    },
    [
      leaveCredits,
      applicationType,
      appStart,
      appEnd,
      appReason,
      daysRequested,
      validateApplication,
      onSubmit,
    ]
  );

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* FULL SCREEN BACKDROP */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      {/* MODAL */}
      <div className="relative z-10 flex w-full max-w-3xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] sm:max-h-[calc(100vh-3rem)]">
        {/* MODAL HEADER */}
        <div className="relative flex flex-none items-center justify-between gap-4 border-b border-slate-200/70 bg-gradient-to-r from-amber-50/80 via-white to-white px-6 py-5 sm:px-7">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
              <FaCalendarAlt className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Apply for Leave
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Submit your leave application for approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {appError && (
            <div className="mx-6 mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-7">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>
                <p>{appError}</p>
              </div>
            </div>
          )}

          {appSuccess && (
            <div className="mx-6 mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-7">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  ✓
                </div>
                <p>{appSuccess}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Leave Type
                </label>
                <select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                >
                  <option value="" disabled>
                    -- Please Select a Leave Type --
                  </option>
                  {leaveCredits.map((l) => (
                    <option key={l.leave_type} value={l.leave_type}>
                      {l.leave_type} ({l.leave_balance ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={appStart}
                  onChange={(e) => setAppStart(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={appEnd}
                  onChange={(e) => setAppEnd(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>

              {/* Days Requested */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Days Requested
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    value={daysRequested}
                    readOnly
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsHalfDay((prev) => !prev)}
                    className={`flex-none rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isHalfDay
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isHalfDay ? "Half Day ✓" : "Half Day"}
                  </button>
                </div>
              </div>

              {/* Approver */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Approver Name
                </label>
                <textarea
                  disabled
                  value={approverName.join("\n")}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              {/* Reason */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Reason
                  </label>
                  <span className="text-xs text-slate-400">Required</span>
                </div>
                <textarea
                  value={appReason}
                  onChange={(e) => setAppReason(e.target.value)}
                  rows={4}
                  placeholder="Please provide a reason for your leave..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-amber-200 transition-all hover:bg-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ApplyLeaveModal;
