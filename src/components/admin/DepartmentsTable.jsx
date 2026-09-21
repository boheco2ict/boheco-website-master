import { FaEdit, FaPlus, FaTrash, FaUserShield } from "react-icons/fa";

function DepartmentsTable({
  departments,
  loading,
  getDepartmentName,
  onAddDepartment,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Department Approval Configuration</h2>
          <p className="mt-1 text-xs text-slate-500">Assign and manage leave approvers by department.</p>
        </div>

        <span className="w-fit rounded-md bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
          {departments.length} {departments.length === 1 ? "department" : "departments"}
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
          <span className="text-sm text-slate-500">Loading approval configuration...</span>
        </div>
      ) : departments.length === 0 ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FaUserShield className="text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No departments configured</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Start by adding a department and assigning employees who can approve leave requests.
          </p>
          <button
            onClick={onAddDepartment}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            <FaPlus /> Add Department
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400">DEPARTMENT</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400">AUTHORIZED APPROVERS</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400">STATUS</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold tracking-wider text-slate-400">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((item) => {
                const approverCount = item.employee_id_email?.length || 0;

                return (
                  <tr key={item.id} className="border-b border-slate-100 transition hover:bg-slate-50/50 last:border-0">
                    <td className="px-5 py-5 align-top">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-xs font-extrabold text-indigo-600">
                          {item.department}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-sm font-bold text-slate-700">{getDepartmentName(item.department)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5 align-top">
                      {approverCount === 0 ? (
                        <span className="text-xs italic text-slate-400">No Approvers Assigned</span>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {item.employee_id_email.slice(0, 3).map((approver, index) => (
                            <div key={`${approver.id}-${index}`} className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <FaUserShield className="text-[10px]" />
                              </div>
                              <div className="flex min-w-0 flex-col">
                                <span className="text-xs font-semibold text-slate-700">{approver.full_name || "Employee Not Found"}</span>
                                <span className="text-[10px] text-slate-400">{approver.email}</span>
                              </div>
                            </div>
                          ))}

                          {approverCount > 3 && (
                            <span className="ml-10 text-[10px] font-semibold text-blue-600">
                              +{approverCount - 3} more {approverCount - 3 === 1 ? "approver" : "approvers"}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-5 align-top">
                      {approverCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Configured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1.5 text-[10px] font-semibold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Needs Setup
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-5 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          onClick={() => onDelete(item)}
                          title="Delete department"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                          <FaTrash className="text-[10px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DepartmentsTable;
