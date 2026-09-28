function OfficeOrderHeader({ onAddClick }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Office Orders
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Employee Office Orders Management
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            Paste a Google Drive office order URL, then choose a
            specific employee or a batch to send.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Add Office Order
        </button>
      </div>
    </div>
  );
}

export default OfficeOrderHeader;
