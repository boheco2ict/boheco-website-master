import { FaEdit } from "react-icons/fa";

function InfoCard({ label, value, wide, highlight, onEdit }) {
  return (
    <div
      className={`rounded-[1.5rem] border border-slate-200 p-5 shadow-sm ${
        wide ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
      style={{ background: "var(--card-bg)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            title={`Edit ${label}`}
            aria-label={`Edit ${label}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <FaEdit className="h-4 w-4" />
          </button>
        )}
      </div>
      <p
        className={`mt-3 break-words text-base font-semibold ${
          highlight ? "text-emerald-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default InfoCard;
