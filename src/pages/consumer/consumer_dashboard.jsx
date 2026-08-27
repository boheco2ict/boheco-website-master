import React from "react";
import {
FaPrint,
FaChevronLeft,
FaChevronRight,
FaFileAlt,
} from "react-icons/fa";

const ConsumerLedger = () => {
const bills = [
    {
    month: "Aug 2026",
    billNumber: "0000332501",
    kwh: "125.00",
    amountDue: "₱ 1,411.79",
    surcharge: "₱ 0.00",
    totalAmount: "₱ 1,411.79",
    dueDate: "Sep 4, 2026",
    },
    {
    month: "Jul 2026",
    billNumber: "0000327940",
    kwh: "114.00",
    amountDue: "₱ 1,358.97",
    surcharge: "₱ 0.00",
    totalAmount: "₱ 1,358.97",
    dueDate: "Aug 4, 2026",
    },
    {
    month: "Jun 2026",
    billNumber: "0000323663",
    kwh: "120.00",
    amountDue: "₱ 1,301.31",
    surcharge: "₱ 0.00",
    totalAmount: "₱ 1,301.31",
    dueDate: "Jul 4, 2026",
    },
    {
    month: "May 2026",
    billNumber: "0000319122",
    kwh: "127.00",
    amountDue: "₱ 1,286.17",
    surcharge: "₱ 0.00",
    totalAmount: "₱ 1,286.17",
    dueDate: "Jun 4, 2026",
    },
    {
    month: "Apr 2026",
    billNumber: "0000314364",
    kwh: "100.00",
    amountDue: "₱ 1,032.82",
    surcharge: "₱ 0.00",
    totalAmount: "₱ 1,032.82",
    dueDate: "May 4, 2026",
    },
];

return (
    <div className="ml-[220px] min-h-screen bg-slate-100 p-5 md:p-8">
    <div className="mx-auto max-w-[1700px] space-y-5">

        {/* =====================================================
            ACCOUNT INFORMATION
        ====================================================== */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:p-8">

            {/* Consumer Information */}
            <div className="lg:col-span-4">

            <div className="mb-2 text-sm font-medium text-emerald-700">
                0101010020
            </div>

            <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                CADELINA, GODFREY
                </h2>

                <span className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                Active
                </span>

            </div>

            <p className="mt-2 text-sm font-medium text-slate-500">
                PANGDAN, JAGNA
            </p>

            </div>

            {/* Divider */}
            <div className="hidden lg:block lg:col-span-1">
            <div className="mx-auto h-full w-px bg-slate-200" />
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2 lg:col-span-7">

            <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-slate-500">
                Meter Number
                </span>

                <span className="text-sm font-semibold text-slate-900">
                51-00667
                </span>
            </div>

            <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-slate-500">
                Email Address
                </span>

                <span className="text-sm font-semibold text-slate-900">
                —
                </span>
            </div>

            <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-slate-500">
                Pole Number
                </span>

                <span className="text-sm font-semibold text-slate-900">
                —
                </span>
            </div>

            <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-slate-500">
                Route Code
                </span>

                <span className="text-sm font-semibold text-slate-900">
                0101
                </span>
            </div>

            <div className="flex items-center justify-between gap-5">
                <span className="text-sm text-slate-500">
                Contact Number
                </span>

                <span className="text-sm font-semibold text-slate-900">
                —
                </span>
            </div>

            </div>

        </div>

        </section>

        {/* =====================================================
            LEDGER
        ====================================================== */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Ledger Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-sm text-white">
            <FaFileAlt />
            </div>

            <h2 className="text-lg font-bold text-slate-900">
            Ledger
            </h2>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] border-collapse">

            <thead>
                <tr className="bg-slate-50">

                <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                    Status
                </th>

                <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                    Billing Month
                </th>

                <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                    Bill Number
                </th>

                <th className="border-b border-r border-slate-200 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700">
                    kWh Used
                </th>

                <th className="border-b border-r border-slate-200 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700">
                    Total Amount Due
                </th>

                <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                    Due Date
                </th>
                </tr>
            </thead>

            <tbody>

                {bills.map((bill, index) => (
                <tr
                    key={index}
                    className="transition hover:bg-slate-50"
                >

                    {/* Status */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-center">

                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                        ✓
                    </span>

                    </td>

                    {/* Billing Month */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-sm font-medium text-slate-700">
                    {bill.month}
                    </td>

                    {/* Bill Number */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-sm text-slate-600">
                    {bill.billNumber}
                    </td>

                    {/* kWh */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm text-slate-700">
                    {bill.kwh}
                    </td>

                    {/* Total */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm font-semibold text-emerald-600">
                    {bill.totalAmount}
                    </td>

                    {/* Due Date */}
                    <td className="border-b border-r border-slate-200 px-4 py-4 text-sm text-slate-700">
                    {bill.dueDate}
                    </td>
                </tr>
                ))}

            </tbody>

            </table>

        </div>
        </section>
    </div>
    </div>
);
};

export default ConsumerLedger;