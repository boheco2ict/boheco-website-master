import { useState } from "react";
import { FaTimes, FaFileInvoiceDollar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const UpdateForm = ({ isOpen, onClose, onSuccess }) => {
    const { consumerInfo, loading: authLoading } = useAuth();

    const currentYear = new Date().getFullYear();

    const initialForm = {
        account_number: "",
        month: "",
        year: "",
        amount: "",
    };

    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState(initialForm);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleClose = () => {
        if (saving) return;
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userID = consumerInfo?.id || "";
        console.log(userID);
        onSuccess();
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

    if (!isOpen) {
        return null;
    }
    if (!consumerInfo) {
        return null;
    }
    return (
        <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
        onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
                handleClose();
            }
        }}
        >
        {/* Modal */}
        <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-start justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                        <FaFileInvoiceDollar className="text-lg" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Change Registered Account
                        </h2>

                        <p className="mt-1 text-sm text-slate-300">
                            Provide your latest account and billing information for
                            verification.
                        </p>
                    </div>
                </div>
            {/* Close Button */}
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={saving}
                    className="ml-4 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Close"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

            {/* Form Body */}
            <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Account Number */}
                <div>
                    <label
                    htmlFor="account_number"
                    className="mb-2 block text-sm font-medium text-slate-700"
                    >
                    Account Number
                    <span className="ml-1 text-red-500">*</span>
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
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 hover:border-slate-400"
                    />

                    <p className="mt-1.5 text-xs text-slate-500">
                    Must contain exactly 10 digits.
                    </p>
                </div>

                {/* Amount */}
                <div>
                    <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-slate-700"
                    >
                    Exact Amount
                    <span className="ml-1 text-red-500">*</span>
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
                        className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 hover:border-slate-400"
                    />
                    </div>
                </div>

                {/* Billing Month */}
                <div>
                    <label
                    htmlFor="month"
                    className="mb-2 block text-sm font-medium text-slate-700"
                    >
                    Billing Month
                    <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                    id="month"
                    name="month"
                    value={form.month}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 hover:border-slate-400"
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
                    className="mb-2 block text-sm font-medium text-slate-700"
                    >
                    Billing Year
                    <span className="ml-1 text-red-500">*</span>
                    </label>

                    <select
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 hover:border-slate-400"
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
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end sm:px-8">
                <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {saving ? "Verifying..." : "Verify"}
                </button>

            </div>
            </form>
        </div>
        </div>
    );
};

export default UpdateForm;