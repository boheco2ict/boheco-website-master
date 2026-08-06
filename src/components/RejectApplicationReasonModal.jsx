import { useState } from "react";

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
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">
          Reject Leave Application
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Please provide a reason for rejecting this leave application.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
          placeholder="Type your reason here..."
          className="mt-4 w-full rounded-lg border border-slate-300 p-3 focus:border-red-500 focus:outline-none"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}