import React from "react";

function Badge({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
      <Icon className="text-amber-500" />
      {text}
    </span>
  );
}

export default Badge;
