import { createPortal } from "react-dom";
import { useState } from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

export default function RejectApplicationModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    if (loading) return;

    setReason("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">

      {/* =====================================================
          BACKDROP
      ====================================================== */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* =====================================================
          MODAL
      ====================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-slate-200/70
          bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
        "
      >

        {/* =================================================
            HEADER
        ================================================== */}
        <div className="relative border-b border-slate-200/70 bg-gradient-to-r from-red-50 via-white to-white px-6 py-5 sm:px-7">

          {/* Red accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-red-400 to-red-600" />

          <div className="flex items-start justify-between gap-4">

            <div className="flex min-w-0 items-center gap-4">

              {/* Warning icon */}
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-red-100 text-red-600 ring-1 ring-red-200">
                <FaExclamationTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  Reject Leave Application
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Provide a reason for rejecting this application.
                </p>
              </div>

            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
              className="
                flex
                h-10
                w-10
                flex-none
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                transition-all
                duration-200
                hover:border-slate-300
                hover:bg-slate-50
                hover:text-slate-900
                focus:outline-none
                focus:ring-2
                focus:ring-red-400
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FaTimes className="h-4 w-4" />
            </button>

          </div>
        </div>


        {/* =================================================
            CONTENT
        ================================================== */}
        <div className="p-6 sm:p-7">

          {/* Warning message */}
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-start gap-3">

              <FaExclamationTriangle className="mt-0.5 h-4 w-4 flex-none text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Rejection reason required
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  Please provide a clear reason. This information
                  will be recorded with the leave application.
                </p>
              </div>

            </div>
          </div>


          {/* Textarea */}
          <div className="mt-5">

            <div className="flex items-center justify-between">
              <label
                htmlFor="rejection-reason"
                className="text-sm font-semibold text-slate-700"
              >
                Rejection Reason
              </label>

              <span className="text-xs text-slate-400">
                Required
              </span>
            </div>

            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              disabled={loading}
              placeholder="Type your reason here..."
              className="
                mt-2
                w-full
                resize-none
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                leading-6
                text-slate-900
                outline-none
                transition-all
                duration-200
                placeholder:text-slate-400
                focus:border-red-400
                focus:bg-white
                focus:ring-2
                focus:ring-red-100
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            />

            <div className="mt-2 flex justify-between">
              <p className="text-xs text-slate-400">
                Explain why this leave application cannot be approved.
              </p>

              <p className="text-xs text-slate-400">
                {reason.length} characters
              </p>
            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================== */}
          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-5
                py-3
                text-sm
                font-semibold
                text-slate-700
                transition-all
                duration-200
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !reason.trim()}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-sm
                shadow-red-200
                transition-all
                duration-200
                hover:bg-red-700
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-red-400
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Rejecting...
                </>
              ) : (
                <>
                  <FaExclamationTriangle className="h-3.5 w-3.5" />
                  Reject Application
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}