import { useState, useEffect } from "react";
import EmployeeHeader from "../../components/admin/AddEmployee";
import AddAccountModal from "../../components/admin/AddAccountModal";
import EmployeeTable from "../../components/admin/employeeTable";
import EditAccountModal from "../../components/admin/editAccountModal";
import { useAuth } from "../../context/AuthContext";
import {
  getAllEmployees,
  getDepartmentMeaning,
  getAllAuthUsers,
  getAllAccounts
} from "../../services/getservices";

const EmployeeManagement = () => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { employeeInfo } = useAuth();

  const loadData = async () => {
    try {
      const [authUsersData, employeesData, departmentData, accountData] = await Promise.all([getAllAuthUsers(), getAllEmployees(), getDepartmentMeaning(), getAllAccounts()]);
      
      // setEmployees(filteredEmployees || []);
      // setDepartmentMeaning(departmentData || []);
      const availableAuthUsers = authUsersData?.filter(
        (authUser) =>
          !accountData?.some(
            (account) => account.user_id === authUser.id
          )
      );
      setAuthUsers(availableAuthUsers || []);
      setAccountsData(accountData || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load records.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEditModal = (editData) => {
    setShowEditModal(true);
    setSelectedAccount(editData);
  }

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedAccount(null);
  }

  const handleSave = (updatedData) => {
    console.log("updatedData", updatedData);
  }

  return (
    <div
      className="min-h-screen w-full p-5"
      style={{ background: "var(--section-bg)" }}
    >
      <EmployeeHeader
        onAddEmployee={() => setShowAccountModal(true)}
      />

      <AddAccountModal
        open={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />

      <EmployeeTable
        accounts={accountsData}
        onEdit={openEditModal}
      />

      <EditAccountModal
        isOpen={showEditModal}
        authUsers={authUsers}
        account={selectedAccount}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
};

export default EmployeeManagement;