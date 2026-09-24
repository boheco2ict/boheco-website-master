import { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { formatName_FN_MI_LN } from "../../utils/utils";

const ITEMS_PER_PAGE = 20;
const MAX_VISIBLE_PAGES = 10;

const AccountTable = ({ accounts = [], departmentList = [], onEdit }) => {
  const [searchName, setSearchName] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // FILTER ACCOUNTS
  const filteredAccounts = useMemo(() => {
    const search = searchName.trim().toLowerCase();

    return accounts.filter((account) => {
      const employee = account?.employee;
      const fullName = formatName_FN_MI_LN(employee?.firstname, employee?.middlename, employee?.lastname).toLowerCase().trim();

      // Search by employee name
      const matchesName = !search || fullName.includes(search);

      // Filter by department code
      const matchesDepartment = !departmentFilter || employee?.department === departmentFilter;

      return matchesName && matchesDepartment;
    });
  }, [accounts, searchName, departmentFilter]);

  // TOTAL PAGES
  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);

  // PAGINATED ACCOUNTS
  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAccounts.slice(startIndex, endIndex);
  }, [filteredAccounts, currentPage]);

  // RESET TO PAGE 1 WHEN FILTER CHANGES
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, departmentFilter]);

  // KEEP PAGE VALID
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // PAGE NUMBERS
  const pageNumbers = useMemo(() => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let startPage = currentPage - Math.floor(MAX_VISIBLE_PAGES / 2);
    let endPage = startPage + MAX_VISIBLE_PAGES - 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = MAX_VISIBLE_PAGES;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - MAX_VISIBLE_PAGES + 1;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }, [currentPage, totalPages]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-hidden border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}
        <div className="px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* TITLE */}
            <div>
              <div className="flex items-center gap-3">
                <p className="text-[20px] font-bold tracking-tight text-slate-800">Employee Accounts</p>
              </div>
              <p className="mt-1 text-sm text-slate-500">Manage and view registered employee accounts</p>
            </div>

            {/* ACCOUNT COUNT */}
            <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-center sm:block">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Accounts</p>
              <p className="mt-0.5 text-lg font-bold text-slate-700">{filteredAccounts.length}</p>
            </div>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="border-y border-slate-200 bg-slate-50/50 px-6 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* SEARCH */}
            <div className="relative w-full lg:w-[69%]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Search by employee name..." className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-32 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />

              {/* CLEAR FILTERS */}
              {(searchName) && (
                <button type="button" onClick={() => { setSearchName(""); setDepartmentFilter(""); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-blue-600">
                  Clear
                </button>
              )}
            </div>

            {/* DEPARTMENT FILTER */}
            <div className="w-full lg:w-[30%]">
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                <option value="">All Departments</option>
                {departmentList.map((department) => (
                  <option key={department.code} value={department.code}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          {/* TABLE HEADER */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {/* Employee Number */}
              {/* <th className="px-6 py-4 text-sm font-semibold text-slate-600">Emp. Num.</th> */}
              {/* Name */}
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
              {/* Position */}
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Position</th>
              {/* Department */}
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Department</th>
              {/* Role */}
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Role</th>
              {/* Status */}
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              {/* Actions */}
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-100">
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((account) => {
                const employee = account?.employee;

                return (
                  <tr key={account?.id} className="transition-colors hover:bg-slate-50">
                    {/* Employee Number */}
                    {/* <td className="px-6 py-4 text-sm font-medium text-slate-700">{employee?.empnumber || "—"}</td> */}

                    {/* Employee Name */}
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {formatName_FN_MI_LN(employee?.firstname, employee?.middlename, employee?.lastname)}
                    </td>

                    {/* Position */}
                    <td className="px-6 py-4 text-sm text-slate-600">{employee?.position || "—"}</td>

                    {/* Department */}
                    <td className="px-6 py-4 text-sm text-slate-600">{employee?.department || "—"}</td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">{account?.role || "—"}</span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {account?.isActive ? (
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">Active</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">Inactive</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button type="button" onClick={() => onEdit(account)} title="Edit account" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                          <FaEdit className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* EMPTY STATE */
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No Accounts Found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* PAGE INFORMATION */}
          <p className="text-sm text-slate-500">
            Page <span className="font-medium text-slate-700">{currentPage}</span> of{" "}
            <span className="font-medium text-slate-700">{totalPages}</span>
          </p>

          {/* PAGINATION BUTTONS */}
          <div className="flex items-center gap-1">
            {/* PREVIOUS BUTTON */}
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" title="Previous page">
              <FaChevronLeft className="text-xs" />
            </button>

            {/* PAGE NUMBERS */}
            {pageNumbers.map((page) => (
              <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${currentPage === page ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {page}
              </button>
            ))}

            {/* NEXT BUTTON */}
            <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" title="Next page">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountTable;