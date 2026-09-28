import { useEffect, useState } from "react";
import {
  getAllEmployees,
  getDepartmentMeaning
} from "../services/getservices";
import { createOfficeOrder } from "../services/postservices";

function useOfficeOrderForm(employee, setOfficeOrderMessage) {
  const [officeOrderName, setOfficeOrderName] = useState("");
  const [officeOrderDescription, setOfficeOrderDescription] = useState("");
  const [officeOrderUrl, setOfficeOrderUrl] = useState("");
  const [recipientType, setRecipientType] = useState("individual");
  const [individualTarget, setIndividualTarget] = useState("");
  const [batchTarget, setBatchTarget] = useState("All");
  const [allEmployee, setAllEmployee] = useState("");
  const [batchEmployeeIds, setBatchEmployeeIds] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [departmentMeaning, setDepartmentMeaning] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const employeeData = await getAllEmployees();
        setAllEmployee(employeeData);
      } catch (error) {
        setAllEmployee("");
        console.error(error);
      }
    };

    fetch();
  }, [employee]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDepartmentMeaning();
        setDepartmentMeaning(data);
      } catch (error) {
        setDepartmentMeaning("");
        console.error(error);
      }
    };

    fetch();
  }, [employee]);

  useEffect(() => {
    if (allEmployee?.length > 0 && batchTarget === "All") {
      const allIds = allEmployee.map((employee) => employee.id);
      setBatchEmployeeIds(allIds);
    }
  }, [allEmployee, batchTarget]);

  // =========================================================
  // RESET OFFICE ORDER FORM
  // =========================================================
  const resetMemoForm = () => {
    setOfficeOrderName("");
    setOfficeOrderUrl("");
    setRecipientType("individual");
    setIndividualTarget("");
    setBatchTarget("All");
    setOfficeOrderMessage("");
    setOfficeOrderDescription("");
  };

  // =========================================================
  // SEND OFFICE ORDER
  // =========================================================
  const handleSendMemo = async (event, onSuccess) => {
    event.preventDefault();
    if (officeOrderName.trim().length === 0) {
      alert("Please enter office order name.");
      return;
    }
    if (officeOrderDescription.trim().length === 0) {
      alert("Please enter office order description.");
      return;
    }
    if (officeOrderUrl.trim().length === 0) {
      alert("Please enter office order URL.");
      return;
    }
    if (recipientType === "individual") {
      if (individualTarget.trim().length === 0) {
        alert("Please select individual recipient.");
        return;
      }
    }
    if (recipientType === "batch") {
      if (!batchEmployeeIds || batchEmployeeIds.length === 0) {
        alert("Please select a batch recipient.");
        return;
      }
    }

    const confirmed = window.confirm(
      "Are you sure you want to send this office order?"
    );
    if (!confirmed) return;
    setSubmitLoading(true);

    try {
      const response = await createOfficeOrder(
        officeOrderName,
        officeOrderDescription,
        officeOrderUrl,
        individualTarget,
        batchEmployeeIds,
        recipientType,
        employee.employee.id
      );
      if (response) {
        onSuccess?.();
        resetMemoForm();
        alert("Office Order Sent Successfully.");
      } else {
        alert("Failed to Send Office Order.");
      }
    } catch (error) {
      console.error(error);
      if (error.name === "Error") {
        alert(error.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getDepartmentName = (departmentCode) => {
    if (!departmentCode || !departmentMeaning?.length) {
      return departmentCode || "Unknown Department";
    }
    const department = departmentMeaning.find(
      (item) => item.code === departmentCode
    );
    return department?.name || departmentCode;
  };

  return {
    officeOrderName,
    setOfficeOrderName,
    officeOrderDescription,
    setOfficeOrderDescription,
    officeOrderUrl,
    setOfficeOrderUrl,
    recipientType,
    setRecipientType,
    individualTarget,
    setIndividualTarget,
    batchTarget,
    setBatchTarget,
    allEmployee,
    setBatchEmployeeIds,
    departmentFilter,
    setDepartmentFilter,
    submitLoading,
    getDepartmentName,
    resetMemoForm,
    handleSendMemo,
  };
}

export default useOfficeOrderForm;
