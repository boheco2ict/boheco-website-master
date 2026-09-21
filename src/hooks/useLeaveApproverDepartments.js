import { useEffect, useState } from "react";
import {
  getLeaveApprovers,
  getDepartmentMeaning,
  getAllEmployees,
} from "../services/getservices";
import { updateLeaveApproverDepartment } from "../services/updateservices";
import { createLeaveApproverDepartment } from "../services/postservices";
import { deleteLeaveApproverDepartment } from "../services/deleteservices";

export function useLeaveApproverDepartments() {
  const [departments, setDepartments] = useState([]);
  const [departmentCode, setDepartmentCode] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [leaveApprovers, departmentMeanings, employeeData] =
        await Promise.all([
          getLeaveApprovers(),
          getDepartmentMeaning(),
          getAllEmployees(),
        ]);
      setDepartments(leaveApprovers || []);
      setDepartmentCode(departmentMeanings || []);
      setEmployees(employeeData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const departmentMap = new Map(
    departmentCode.map((item) => [item.code, item.name])
  );

  const getDepartmentName = (code) => departmentMap.get(code) || code;

  // Returns true on success (caller should close the modal), false on
  // a handled failure (caller should keep the modal open).
  const saveDepartment = async (
    departmentValue,
    cleanedApprovers,
    editingDepartmentId
  ) => {
    try {
      setSaving(true);

      if (editingDepartmentId) {
        const upRes = await updateLeaveApproverDepartment(
          editingDepartmentId,
          departmentValue,
          cleanedApprovers
        );
        if (upRes) {
          alert("Leave Approvers Updated Successfully.");
        }
      } else {
        const delRes = await createLeaveApproverDepartment(
          departmentValue,
          cleanedApprovers
        );
        if (delRes) {
          alert("Department Added Successfully.");
        }
      }

      await loadData();
      return true;
    } catch (error) {
      console.error("Error saving leave approvers:", error);

      if (error.code === "23505") {
        alert("This department already exists.");
        return false;
      }

      alert("Failed to save leave approvers.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const departmentName = getDepartmentName(item.department);
    const confirmed = window.confirm(
      `Are you sure you want to delete ${departmentName}?`
    );

    if (!confirmed) return;

    try {
      await deleteLeaveApproverDepartment(item.id);
      await loadData();
      alert("Leave Approver Department Deleted Successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return {
    departments,
    departmentCode,
    employees,
    loading,
    saving,
    getDepartmentName,
    saveDepartment,
    handleDelete,
  };
}
