import React from "react";

function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
        <Icon size={24} />
      </div>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}

export default EmptyState;
