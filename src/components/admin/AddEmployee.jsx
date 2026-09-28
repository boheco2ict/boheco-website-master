// EmployeeHeader.jsx

import { FaPlus } from "react-icons/fa";

const AddEmployee = ({ onAddEmployee }) => {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400">
              ADMINISTRATION
            </span>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">
              Employee Management
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Manage employee records, department assignments,
              employment information, and account details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddEmployee}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
        >
          <FaPlus className="text-xs" />
          Add Employee
        </button>
      </div>
    </div>
  );
};

export default AddEmployee;