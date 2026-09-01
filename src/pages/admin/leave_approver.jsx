import { useEffect, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaUserShield,
  FaTimes,
} from "react-icons/fa";

import {
  getLeaveApprovers,
  getDepartmentMeaning,
  getAllEmployees,
} from "../../services/getservices";

import {
  updateLeaveApproverDepartment,
} from "../../services/updateservices";

import {
  createLeaveApproverDepartment,
} from "../../services/postservices";

import {
  deleteLeaveApproverDepartment,
} from "../../services/deleteservices";

const LeaveApproverManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentCode, setDepartmentCode] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [department, setDepartment] = useState("");
  const [approvers, setApprovers] = useState([{ id: "", email: "" }]);


  // =====================================================
  // LOAD DATA
  // =====================================================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [leaveApprovers, departmentMeanings, employeeData] = await Promise.all([
        getLeaveApprovers(), getDepartmentMeaning(), getAllEmployees()
      ]);

      setDepartments(leaveApprovers || []);
      setDepartmentCode(departmentMeanings || []);
      setEmployees(employeeData || []);
    } catch (error) {
      console.error("Error loading leave approval data:", error);
      alert("Failed to load leave approval configuration.");
    } finally {
      setLoading(false);
    }
  };

  const departmentMap = new Map(departmentCode.map((item) => [item.code, item.name]));

  const getDepartmentName = (code) => departmentMap.get(code) || code;

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

  const openAddModal = () => {
    setEditingDepartment(null);
    setDepartment("");
    setApprovers([{ id: "", email: "" }]);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingDepartment(item);
    setDepartment(item.department || "");

    setApprovers(
      item.employee_id_email?.length
        ? item.employee_id_email.map((approver) => ({
            id: String(approver.id || ""),
            email: approver.email || "",
          }))
        : [{ id: "", email: "" }]
    );

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingDepartment(null);
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

    try {
      setSaving(true);

      if (editingDepartment) {
        await updateLeaveApproverDepartment(editingDepartment.id, departmentValue, cleanedApprovers);
      } else {
        await createLeaveApproverDepartment(departmentValue, cleanedApprovers);
      }

      await loadData();
      setShowModal(false);
      setEditingDepartment(null);

      alert(
        editingDepartment
          ? "Leave approvers updated successfully."
          : "Department added successfully."
      );
    } catch (error) {
      console.error("Error saving leave approvers:", error);

      if (error.code === "23505") {
        alert("This department already exists.");
        return;
      }

      alert("Failed to save leave approvers.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const departmentName = getDepartmentName(item.department);
    const confirmed = window.confirm(`Are you sure you want to delete ${departmentName}?`);

    if (!confirmed) return;

    try {
      await deleteLeaveApproverDepartment(item.id);
      await loadData();
      alert("Department deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete department.");
    }
  };

  const configuredDepartments = departments.filter(
    (item) => item.employee_id_email && item.employee_id_email.length > 0
  ).length;

  const totalApprovers = departments.reduce(
    (total, item) => total + (item.employee_id_email?.length || 0),
    0
  );


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mb-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400">ADMINISTRATION</span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">Leave Approvers</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Manage employees authorized to approve leave requests for each department.
              </p>
            </div>
          </div>

          <button onClick={openAddModal} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]">
            <FaPlus className="text-xs" /> Add Department
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><FaUserShield /></div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Departments</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{departments.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><FaUserShield /></div>
          <div>
            <p className="text-xs font-medium text-slate-500">Configured Departments</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{configuredDepartments}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><FaUserShield /></div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Approvers</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{totalApprovers}</p>
          </div>
        </div>
      </div>

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
            <button onClick={openAddModal} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700">
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
                          <span className="text-xs italic text-slate-400">No approvers assigned</span>
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
                            onClick={() => openEditModal(item)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FaEdit /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
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

      {showModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
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
                onClick={closeModal}
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
                    <option value="">Select a department</option>
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
                                {employee.id}{" - "}{formatEmployeeName(employee)}
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
                onClick={closeModal}
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
      )}
    </div>
  );
};

export default LeaveApproverManagement;