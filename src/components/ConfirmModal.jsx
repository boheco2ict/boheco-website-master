import React from "react";
import { createPortal } from "react-dom";

const ConfirmModal = ({ open, title, text, icon, confirmText = "Yes", cancelText = "Cancel", loading = false, onConfirm, onCancel }) => {
  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 text-center shadow-xl">
        <div className="flex items-center justify-center">
          <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${icon === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {icon === 'warning' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M5.93 19h12.14a2 2 0 001.77-2.99L13.77 4.99a2 2 0 00-3.54 0L4.16 16.01A2 2 0 005.93 19z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
        {text && <p className="mb-4 text-sm text-slate-600">{text}</p>}

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Please wait...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmModal;
