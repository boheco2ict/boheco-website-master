import { useState } from "react";
import { FaEdit, FaPlus, FaTrash, FaUserShield, FaTimes } from "react-icons/fa";

function DepartmentApproverModal({
  departments,
  employees,
  departmentCode,
  getDepartmentName,
  editingDepartment,
  saving,
  onSave,
  onClose,
}) {
  const [department, setDepartment] = useState(editingDepartment?.department || "");
  const [approvers, setApprovers] = useState(
    editingDepartment?.employee_id_email?.length
      ? editingDepartment.employee_id_email.map((approver) => ({
          id: String(approver.id || ""),
          email: approver.email || "",
        }))
      : [{ id: "", email: "" }]
  );

  const filteredEmployees = employees.filter(
    (employee) => employee.department?.trim().toUpperCase() === department?.trim().toUpperCase()
  );

  const formatEmployeeName = (employee) => {
    if (!employee) return "";

    const firstName = employee.firstname || "";
    const middleInitial = employee.middlename ? `${employee.middlename.charAt(0)}.` : "";
    const lastName = employee.lastname || "";

    return `${firstName} ${middleInitial} ${lastName}`.replace(/\s+/g, " ").trim();
  };

  const isEmployeeAlreadySelected = (employeeId, currentIndex) => {
    return approvers.some(
      (approver, index) => index !== currentIndex && String(approver.id) === String(employeeId)
    );
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setApprovers([{ id: "", email: "" }]);
  };

  const handleApproverChange = (index, field, value) => {
    setApprovers((current) =>
      current.map((approver, i) => {
        if (i !== index) return approver;

        if (field === "id") {
          const employee = employees.find((employee) => String(employee.id) === String(value));

          return {
            ...approver,
            id: value,
            email: employee?.email || "",
            employee: employee || null,
          };
        }

        return approver;
      })
    );
  };

  const addApprover = () => {
    setApprovers((current) => [...current, { id: "", email: "" }]);
  };

  const removeApprover = (index) => {
    setApprovers((current) => current.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = async () => {
    if (!department.trim()) {
      alert("Please select a department.");
      return;
    }

    const departmentValue = department.trim().toUpperCase();

    const departmentExists = departments.some((item) => {
      const existingDepartment = item.department?.trim().toUpperCase();

      if (!editingDepartment) return existingDepartment === departmentValue;

      if (String(item.id) === String(editingDepartment.id)) return false;

      return existingDepartment === departmentValue;
    });

    if (departmentExists) {
      alert(`The department "${getDepartmentName(departmentValue)}" (${departmentValue}) already exists.`);
      return;
    }

    const cleanedApprovers = approvers
      .map((approver) => ({
        id: String(approver.id || "").trim(),
        email: approver.email?.trim() || "",
      }))
      .filter((approver) => approver.id || approver.email);

    for (const approver of cleanedApprovers) {
      if (!approver.id || !approver.email) {
        alert("Every approver must have Email.");
        return;
      }
    }

    for (const approver of cleanedApprovers) {
      const employee = employees.find((employee) => String(employee.id) === String(approver.id));

      if (!employee) {
        alert("One of the selected employees could not be found.");
        return;
      }

      const employeeDepartment = employee.department?.trim().toUpperCase();

      if (employeeDepartment !== departmentValue) {
        alert(`${formatEmployeeName(employee)} does not belong to the selected department.`);
        return;
      }
    }

    const employeeIds = cleanedApprovers.map((approver) => approver.id);

    if (new Set(employeeIds).size !== employeeIds.length) {
      alert("Duplicate employees are not allowed.");
      return;
    }

    const emails = cleanedApprovers.map((approver) => approver.email.toLowerCase());

    if (new Set(emails).size !== emails.length) {
      alert("Duplicate emails are not allowed.");
      return;
    }

    await onSave(departmentValue, cleanedApprovers);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {editingDepartment ? <FaEdit /> : <FaPlus />}
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.15em] text-slate-400">LEAVE MANAGEMENT</span>
              <h2 className="mt-0.5 text-lg font-bold text-slate-800">
                {editingDepartment ? "Edit Leave Approvers" : "Add Department"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">Configure employees authorized to approve leave requests.</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="pb-6">
            <div className="mb-5 flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-500">01</span>
              <div>
                <h3 className="text-sm font-bold text-slate-700">Department Information</h3>
                <p className="mt-1 text-[10px] text-slate-400">Select the department for this approval configuration.</p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Department <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={saving}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
              >
                <option value="">Select a Department</option>
                {departmentCode.map((dept) => (
                  <option key={dept.code} value={dept.code}>{dept.code}{" - "}{dept.name}</option>
                ))}
              </select>

              <p className="mt-1.5 text-[9px] text-slate-400">Select the official department for this configuration.</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="mb-5 flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[9px] font-bold text-slate-500">02</span>
              <div>
                <h3 className="text-sm font-bold text-slate-700">Authorized Approvers</h3>
                <p className="mt-1 text-[10px] text-slate-400">Only employees belonging to the selected department can be selected.</p>
              </div>
            </div>

            {!department && (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                <FaUserShield className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-500">Select a department first</p>
                <p className="mt-1 text-[10px] text-slate-400">Employees will appear here after selecting a department.</p>
              </div>
            )}

            {department && (
              <div className="space-y-2.5">
                {approvers.map((approver, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-[30px_1fr_1fr_34px] sm:items-end"
                  >
                    <div className="hidden h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-[9px] font-bold text-slate-400 sm:flex">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                        Employee <span className="ml-1 text-red-500">*</span>
                      </label>

                      <select
                        value={approver.id || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;

                          if (selectedId && isEmployeeAlreadySelected(selectedId, index)) {
                            alert("This employee is already assigned as an approver.");
                            return;
                          }

                          handleApproverChange(index, "id", selectedId);
                        }}
                        disabled={saving || !department}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                      >
                        <option value="">
                          {filteredEmployees.length === 0 ? "No employees found" : "Select Employee"}
                        </option>

                        {filteredEmployees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {formatEmployeeName(employee)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-semibold text-slate-600">
                        Email Address <span className="ml-1 text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        value={approver.email || ""}
                        readOnly
                        placeholder="Email will be loaded automatically"
                        disabled={saving}
                        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <button
                      onClick={() => removeApprover(index)}
                      disabled={saving}
                      title="Remove Approver"
                      className="flex h-9 w-full items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-30 sm:w-9"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                ))}

                {filteredEmployees.length > approvers.length && (
                  <button
                    onClick={addApprover}
                    disabled={saving}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white text-xs font-semibold text-slate-500 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaPlus className="text-[10px]" /> Add Another Approver
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleClose}
            disabled={saving}
            className="h-10 rounded-lg border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !department}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                {editingDepartment ? <FaEdit /> : <FaPlus />}
                {editingDepartment ? "Save Changes" : "Add Department"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DepartmentApproverModal;
