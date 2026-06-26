import EmptyState from "./EmptyState";
import { FaRegFileAlt } from "react-icons/fa";
import FormatDate from "./FormatDate";

function OfficeOrderTab({
  isAdmin,
  orderMode,
  setOrderMode,
  orderTitle,
  setOrderTitle,
  orderUrl,
  setOrderUrl,
  orderRecipientType,
  setOrderRecipientType,
  orderEmployeeTarget,
  setOrderEmployeeTarget,
  orderBatchTarget,
  setOrderBatchTarget,
  orderMessage,
  recipientOrders,
  isOrderLoading,
  onSendOrder,
  onCancelOrder,
  canSendOrder,
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Office Orders</p>
            <h2 className="text-2xl font-semibold text-slate-900">
              Office Order Management
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Paste a Google Drive office order URL, then choose a specific
              employee or a batch to send.
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setOrderMode("add")}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Add Office Order
            </button>
          )}
        </div>
      </div>

      {orderMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {orderMessage}
        </div>
      )}

      {orderMode === "add" && !isAdmin ? (
        <EmptyState
          icon={FaRegFileAlt}
          title="Access denied"
          message="Only administrators can add office orders."
        />
      ) : orderMode === "add" ? (
        <form
          onSubmit={onSendOrder}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Office Order Title
              </label>
              <input
                type="text"
                value={orderTitle}
                onChange={(event) => setOrderTitle(event.target.value)}
                placeholder="Enter office order name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Office Order URL
              </label>
              <input
                type="url"
                value={orderUrl}
                onChange={(event) => setOrderUrl(event.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">
                Send office order to
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={orderRecipientType === "employee"}
                    onChange={() => setOrderRecipientType("employee")}
                    className="h-4 w-4"
                  />
                  Specific employee
                </label>
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={orderRecipientType === "batch"}
                    onChange={() => setOrderRecipientType("batch")}
                    className="h-4 w-4"
                  />
                  Batch send
                </label>
              </div>

              {orderRecipientType === "employee" ? (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Employee Number
                  </label>
                  <input
                    type="text"
                    value={orderEmployeeTarget}
                    onChange={(event) =>
                      setOrderEmployeeTarget(
                        event.target.value.replace(/\D/g, "")
                      )
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
                    value={orderBatchTarget}
                    onChange={(event) =>
                      setOrderBatchTarget(event.target.value)
                    }
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
              onClick={onCancelOrder}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSendOrder}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-700"
            >
              Send office order
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Assigned office orders
              </h3>
              <p className="text-sm text-slate-600">
                View office orders assigned to you here.
              </p>
            </div>
            {isOrderLoading && (
              <span className="text-sm text-slate-500">Loading orders…</span>
            )}
          </div>

          {isOrderLoading ? (
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : recipientOrders.length > 0 ? (
            <div className="mt-6 space-y-3">
              {recipientOrders.map((item) => {
                const order = item.office_order || {};
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium themed-muted">
                          Office order
                        </p>
                        <p className="text-base font-semibold themed-text">
                          {order.title || "Untitled office order"}
                        </p>
                      </div>
                      <a
                        href={order.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        View office order
                      </a>
                    </div>
                    {order.created_at && (
                      <p className="mt-3 text-sm text-slate-500">
                        Posted {FormatDate(order.created_at)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={FaRegFileAlt}
              title="No office orders assigned"
              message="Office orders sent to you will appear here."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default OfficeOrderTab;
