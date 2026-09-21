import { FaUserShield } from "react-icons/fa";

function DepartmentStatsCards({ departments }) {
  const configuredDepartments = departments.filter(
    (item) => item.employee_id_email && item.employee_id_email.length > 0
  ).length;

  const totalApprovers = departments.reduce(
    (total, item) => total + (item.employee_id_email?.length || 0),
    0
  );

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <FaUserShield />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Total Departments</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{departments.length}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <FaUserShield />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Configured Departments</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{configuredDepartments}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FaUserShield />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">Total Approvers</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{totalApprovers}</p>
        </div>
      </div>
    </div>
  );
}

export default DepartmentStatsCards;
