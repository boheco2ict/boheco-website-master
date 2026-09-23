import { FaEdit } from "react-icons/fa";
import { formatName_FN_MI_LN } from "../../utils/utils";

const AccountTable = ({ accounts, onEdit }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Employee #
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Name
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Position
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Department
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Role
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {accounts.map((account) => {
              const employee = account?.employee;
              return (
                <tr
                  key={account?.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  {/* Employee Number */}
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {employee?.empnumber}
                  </td>

                  {/* Employee Name */}
                  <td className="px-6 py-4">
                    {formatName_FN_MI_LN(employee?.firstname, employee?.middlename, employee?.lastname)}
                  </td>

                  {/* Position */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {employee?.position || "—"}
                  </td>

                  {/* Department */}
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {employee?.department || "—"}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      {account.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {account.isActive ? (
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => onEdit(account)}
                        title="Edit account"
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          text-slate-500
                          transition
                          hover:bg-blue-50
                          hover:text-blue-600
                          focus:outline-none
                          focus:ring-2
                          focus:ring-blue-500/30
                        "
                      >
                        <FaEdit className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;