import { useEffect, useState } from "react";
import {
  getAllEmployees,
  getDepartmentMeaning,
} from "../services/getservices";

export function useEmployeeDirectory(employee) {
  const [allEmployee, setAllEmployee] = useState("");
  const [departmentMeaning, setDepartmentMeaning] = useState(null);

  useEffect(() => {
    const fetchallemployee = async () => {
      try {
        const employeeData = await getAllEmployees();
        setAllEmployee(employeeData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchallemployee();
  }, [employee]);

  useEffect(() => {
    const fetchDepartmentMeaning = async () => {
      try {
        const data = await getDepartmentMeaning();
        setDepartmentMeaning(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDepartmentMeaning();
  }, [employee]);

  const getDepartmentName = (departmentCode) => {
    if (!departmentCode || !departmentMeaning?.length) {
      return departmentCode || "Unknown Department";
    }
    const department = departmentMeaning.find(
      (item) => item.code === departmentCode
    );
    return department?.name || departmentCode;
  };

  return { allEmployee, departmentMeaning, getDepartmentName };
}
