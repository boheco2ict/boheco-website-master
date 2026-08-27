import { useState } from "react";
import { createConsumer } from "../../services/postservices";

const ConsumerForm = ({ ID, onSuccess }) => {
  const currentYear = new Date().getFullYear();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    user_id: ID || "",
    account_number: "",
    month: "",
    year: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const response = await createConsumer(form);
      if (response.success) {
        alert("Account Verified Successfully.");
        onSuccess();
      } else {
        alert("Account Verification Failed.");
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => currentYear - index
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-700">
          <h2 className="text-2xl font-semibold text-white">
            Consumer Information
          </h2>

          <p className="mt-1 text-sm text-slate-300">
            Please provide your latest account and billing information, for account verification.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Number */}
            <div>
              <label
                htmlFor="account_number"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Account Number
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                id="account_number"
                name="account_number"
                value={form.account_number}
                onChange={handleChange}
                placeholder="10-digit account number"
                maxLength={10}
                pattern="[0-9]{10}"
                inputMode="numeric"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              />

              <p className="mt-1.5 text-xs text-slate-500">
                Must contain exactly 10 digits.
              </p>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Exact Amount
                <span className="text-red-500 ml-1">*</span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  ₱
                </span>

                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
                />
              </div>
            </div>

            {/* Billing Month */}
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Billing Month
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                id="month"
                name="month"
                value={form.month}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              >
                <option value="" disabled>
                  Select month
                </option>

                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Billing Year */}
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Billing Year
                <span className="text-red-500 ml-1">*</span>
              </label>

              <select
                id="year"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              >
                <option value="" disabled>
                  Select year
                </option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsumerForm;