import React from "react";
import {
  FaBell,
  FaUserCircle,
  FaHome,
  FaUser,
  FaFileInvoiceDollar,
  FaBriefcase,
  FaChartLine,
  FaMoneyBillWave,
  FaListAlt,
  FaCog,
  FaQuestionCircle,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaFileAlt,
} from "react-icons/fa";

const ConsumerLedger = () => {
  // Sample ledger data
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
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-[70px] flex-col items-center border-r border-slate-200 bg-white">

        {/* Logo */}
        <div className="flex h-[64px] w-full items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-xl text-yellow-300">
            ☀
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex w-full flex-col items-center gap-2 px-2 py-5">

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              bg-emerald-700 text-white
              transition hover:bg-emerald-800
            "
          >
            <FaHome />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaUser />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaFileInvoiceDollar />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaBriefcase />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaChartLine />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaMoneyBillWave />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaListAlt />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaCog />
          </button>

          <button
            className="
              flex h-11 w-11 items-center justify-center rounded-lg
              text-slate-500 transition
              hover:bg-emerald-50 hover:text-emerald-700
            "
          >
            <FaQuestionCircle />
          </button>

        </nav>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="ml-[70px] min-h-screen">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <header className="flex h-[64px] items-center justify-between bg-emerald-950 px-6 text-white shadow-sm">

          {/* Brand */}
          <div className="flex items-center gap-3">

            <div className="text-2xl text-yellow-300">
              ☀
            </div>

            <h1 className="text-lg font-bold tracking-wide">
              BOHECO <span className="font-normal">| Assiat</span>
            </h1>

          </div>

          {/* Header actions */}
          <div className="flex items-center gap-5">

            <button className="relative text-xl text-white transition hover:text-emerald-200">

              <FaBell />

              <span
                className="
                  absolute -right-1 -top-1
                  h-2 w-2 rounded-full
                  bg-red-500
                "
              />

            </button>

            <button className="text-2xl transition hover:text-emerald-200">
              <FaUserCircle />
            </button>

          </div>

        </header>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}
        <div className="mx-auto max-w-[1700px] space-y-5 p-5 md:p-6">

          {/* =====================================================
              ACCOUNT INFORMATION
          ====================================================== */}
          <section
            className="
              rounded-xl border border-slate-200
              bg-white shadow-sm
            "
          >

            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12 lg:p-8">

              {/* Consumer information */}
              <div className="lg:col-span-4">

                <div className="mb-2 text-sm font-medium text-emerald-700">
                  0101010020
                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    ABARQUEZ, VICENTE
                  </h2>

                  <span
                    className="
                      rounded-md bg-emerald-100
                      px-3 py-1
                      text-xs font-bold uppercase
                      text-emerald-700
                    "
                  >
                    Active
                  </span>

                </div>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  CENTRO, TUBIGON
                </p>

              </div>

              {/* Vertical divider */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="mx-auto h-full w-px bg-slate-200" />
              </div>

              {/* Account details */}
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
          <section
            className="
              overflow-hidden rounded-xl
              border border-slate-200
              bg-white shadow-sm
            "
          >

            {/* Ledger header */}
            <div
              className="
                flex items-center gap-3
                border-b border-slate-200
                px-5 py-4
              "
            >

              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full bg-emerald-700
                  text-sm text-white
                "
              >
                <FaFileAlt />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Ledger
              </h2>

            </div>

            {/* =================================================
                TABLE
            ================================================== */}
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px] border-collapse">

                <thead>

                  <tr className="bg-slate-50">

                    <th className="w-14 border-b border-r border-slate-200 px-4 py-3">
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
                      Amount Due
                    </th>

                    <th className="border-b border-r border-slate-200 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700">
                      Surcharges
                    </th>

                    <th className="border-b border-r border-slate-200 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-700">
                      Total Amount Due
                    </th>

                    <th className="border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-700">
                      Due Date
                    </th>

                    <th className="w-16 border-b border-slate-200 px-4 py-3 text-center">
                      <FaPrint className="mx-auto text-slate-500" />
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

                        <span
                          className="
                            inline-flex h-5 w-5
                            items-center justify-center
                            rounded-full
                            bg-emerald-600
                            text-[11px] font-bold
                            text-white
                          "
                        >
                          ✓
                        </span>

                      </td>

                      {/* Month */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-sm font-medium text-slate-700">
                        {bill.month}
                      </td>

                      {/* Bill number */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-sm text-slate-600">
                        {bill.billNumber}
                      </td>

                      {/* kWh */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm text-slate-700">
                        {bill.kwh}
                      </td>

                      {/* Amount */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm text-slate-700">
                        {bill.amountDue}
                      </td>

                      {/* Surcharge */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm text-slate-700">
                        {bill.surcharge}
                      </td>

                      {/* Total */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-right text-sm font-semibold text-emerald-600">
                        {bill.totalAmount}
                      </td>

                      {/* Due date */}
                      <td className="border-b border-r border-slate-200 px-4 py-4 text-sm text-slate-700">
                        {bill.dueDate}
                      </td>

                      {/* Print */}
                      <td className="border-b border-slate-200 px-4 py-4 text-center">

                        <button
                          className="
                            text-slate-400
                            transition
                            hover:text-emerald-700
                          "
                          title="Print Bill"
                        >
                          <FaPrint />
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}
            <div
              className="
                flex flex-col gap-4
                border-t border-slate-200
                px-5 py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <span className="text-sm text-slate-500">
                Showing 1 to {bills.length} of 24 entries
              </span>

              <div className="flex items-center gap-2">

                {/* Previous */}
                <button
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-md border border-slate-200
                    bg-white text-slate-400
                    transition
                    hover:bg-slate-50
                  "
                >
                  <FaChevronLeft className="text-xs" />
                </button>

                {/* Page 1 */}
                <button
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-md
                    bg-emerald-700
                    text-sm font-semibold
                    text-white
                  "
                >
                  1
                </button>

                {/* Page 2 */}
                <button
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-md border border-slate-200
                    bg-white text-sm
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  2
                </button>

                {/* Next */}
                <button
                  className="
                    flex h-9 w-9 items-center justify-center
                    rounded-md border border-slate-200
                    bg-white text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >
                  <FaChevronRight className="text-xs" />
                </button>

                {/* Page size */}
                <select
                  className="
                    ml-3 h-9 rounded-md
                    border border-slate-200
                    bg-white px-3
                    text-sm text-slate-700
                    outline-none
                    focus:border-emerald-600
                    focus:ring-1 focus:ring-emerald-600
                  "
                  defaultValue="12"
                >
                  <option value="12">
                    12 / page
                  </option>

                  <option value="24">
                    24 / page
                  </option>

                  <option value="36">
                    36 / page
                  </option>
                </select>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
};

export default ConsumerLedger;