import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="min-h-screen px-4 pb-12 pt-20 sm:px-6 lg:px-10" style={{ background: 'var(--section-bg)' }}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Manage your account settings, password, and profile preferences from here.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1">
          <Link
            to="/reset-password"
            className="rounded-2xl border border-slate-200 bg-amber-50 px-6 py-8 text-center text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
