import EmptyState from "./EmptyState";
import { FaRegFileAlt } from "react-icons/fa";
import FormatDate from "./FormatDate";

function MemoTab({
  isAdmin,
  memoMode,
  setMemoMode,
  memoName,
  setMemoName,
  memoUrl,
  setMemoUrl,
  recipientType,
  setRecipientType,
  employeeTarget,
  setEmployeeTarget,
  batchTarget,
  setBatchTarget,
  memoMessage,
  recipientMemos,
  isMemoLoading,
  onSendMemo,
  onCancelMemo,
  canSendMemo,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Memos</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Employee Memo Management
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Paste a Google Drive memo URL, then choose a specific employee or
              a batch to send.
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setMemoMode("add")}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Add Memo
            </button>
          )}
        </div>
      </div>

      {memoMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {memoMessage}
        </div>
      )}

      {memoMode === "add" && !isAdmin ? (
        <EmptyState
          icon={FaRegFileAlt}
          title="Access denied"
          message="Only administrators can add memos."
        />
      ) : memoMode === "add" ? (
        <form
          onSubmit={onSendMemo}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Memo Name
              </label>
              <input
                type="text"
                value={memoName}
                onChange={(event) => setMemoName(event.target.value)}
                placeholder="Enter memo name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Memo URL
              </label>
              <input
                type="url"
                value={memoUrl}
                onChange={(event) => setMemoUrl(event.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Send memo to
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={recipientType === "employee"}
                    onChange={() => setRecipientType("employee")}
                    className="h-4 w-4"
                  />
                  Specific employee
                </label>
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={recipientType === "batch"}
                    onChange={() => setRecipientType("batch")}
                    className="h-4 w-4"
                  />
                  Batch send
                </label>
              </div>

              {recipientType === "employee" ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Employee Number
                  </label>
                  <input
                    type="text"
                    value={employeeTarget}
                    onChange={(event) =>
                      setEmployeeTarget(event.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter employee number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Batch target
                  </label>
                  <select
                    value={batchTarget}
                    onChange={(event) => setBatchTarget(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="all">All employees</option>
                    <option value="management">Management team</option>
                    <option value="support">Support staff</option>
                    <option value="field">Field staff</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancelMemo}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSendMemo}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-700"
            >
              Send memo
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Assigned memos
              </h3>
              <p className="text-sm text-slate-600">
                View memos assigned to you here.
              </p>
            </div>
            {isMemoLoading && (
              <span className="text-sm text-slate-500">Loading memos…</span>
            )}
          </div>

          {isMemoLoading ? (
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : recipientMemos.length > 0 ? (
            <div className="mt-6 space-y-3">
              {recipientMemos.map((item) => {
                const memo = item.memo || {};
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium themed-muted">
                          Memo name
                        </p>
                        <p className="text-base font-semibold themed-text">
                          {memo.title || "Untitled memo"}
                        </p>
                      </div>
                      <a
                        href={memo.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        View memo
                      </a>
                    </div>
                    {memo.created_at && (
                      <p className="mt-3 text-sm text-slate-500">
                        Posted {FormatDate(memo.created_at)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={FaRegFileAlt}
              title="No memos assigned"
              message="Memos sent to you will appear here."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MemoTab;
