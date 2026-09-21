import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLeaveApproverDepartments } from "../../hooks/useLeaveApproverDepartments";
import DepartmentStatsCards from "../../components/admin/DepartmentStatsCards";
import DepartmentsTable from "../../components/admin/DepartmentsTable";
import DepartmentApproverModal from "../../components/admin/DepartmentApproverModal";

const LeaveApproverManagement = () => {
  const {
    departments,
    departmentCode,
    employees,
    loading,
    saving,
    getDepartmentName,
    saveDepartment,
    handleDelete,
  } = useLeaveApproverDepartments();

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const openAddModal = () => {
    setEditingDepartment(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingDepartment(item);
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async (departmentValue, cleanedApprovers) => {
    const success = await saveDepartment(
      departmentValue,
      cleanedApprovers,
      editingDepartment?.id
    );
    if (success) {
      setShowModal(false);
      setEditingDepartment(null);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-slate-50">
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

      <DepartmentStatsCards departments={departments} />

      <DepartmentsTable
        departments={departments}
        loading={loading}
        getDepartmentName={getDepartmentName}
        onAddDepartment={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {showModal && (
        <DepartmentApproverModal
          departments={departments}
          employees={employees}
          departmentCode={departmentCode}
          getDepartmentName={getDepartmentName}
          editingDepartment={editingDepartment}
          saving={saving}
          onSave={handleSaveDepartment}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default LeaveApproverManagement;
