import { useState, useEffect } from "react";
import EmployeeHeader from "../../components/admin/AddEmployee";
import AddAccountModal from "../../components/admin/AddAccountModal";
import EmployeeTable from "../../components/admin/employeeTable";
import EditAccountModal from "../../components/admin/editAccountModal";
import IncompleteAccountTable from "../../components/admin/IncompleteAccountTable";
import {
  getDepartmentMeaning,
  getAllAuthUsers,
  getAllAccounts,
  getEmploymentStatus
} from "../../services/getservices";

const EmployeeManagement = () => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);
  const [authUsersAll, setAuthUsersAll] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [incompleteAccount, setIncompleteAccount] = useState([]);
  const [employmentStatus, setEmploymentStatus] = useState([]);

  const filterIncompleteAccount = (data = []) => {
    return data.filter((account) => {
      const employee = account?.employee;
      return (
        !employee?.department ||
        !employee?.empnumber ||
        !employee?.firstname ||
        !employee?.lastname
      );
    });
  };

  const filterCompleteAccount = (data = []) => {
    return data.filter((account) => {
      const employee = account?.employee;
      return (
        employee?.department &&
        employee?.empnumber &&
        employee?.firstname &&
        employee?.lastname
      );
    });
  };

  const loadData = async () => {
    try {
      const [authUsersData, departmentData, accountData, employmentStatusData] = await Promise.all([getAllAuthUsers(), getDepartmentMeaning(), getAllAccounts(), getEmploymentStatus()]);
      const filteredAuthUsersData = authUsersData.filter((authUser) => !accountData.some((account) => account.user_id === authUser.id));
      setAuthUsersAll(authUsersData);
      setEmploymentStatus(employmentStatusData || []);
      setDepartmentList(departmentData || []);
      setAuthUsers(filteredAuthUsersData || []);
      setAccountsData(filterCompleteAccount(accountData) || []);
      setIncompleteAccount(filterIncompleteAccount(accountData) || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditModal = (editData) => {
    setShowEditModal(true);
    setSelectedAccount(editData);
  }

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedAccount(null);
  }

  const handleCloseEdit = () => {
    handleCloseModal();
    loadData();
  }

  const addAccountSuccess = () => {
    setShowAccountModal(false);
    loadData();
  }

  return (
    <div className="min-h-screen w-full p-5" style={{ background: "var(--section-bg)" }}>
      <EmployeeHeader
        onAddEmployee={() => setShowAccountModal(true)}
      />

      <AddAccountModal
        open={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccess={addAccountSuccess}
      />

      {incompleteAccount?.length > 0 && (
        <IncompleteAccountTable
          incompleteAccount={incompleteAccount}
          onEdit={openEditModal}
        />
      )}
      
      <EmployeeTable
        accounts={accountsData}
        departmentList={departmentList}
        onEdit={openEditModal}
      />
      

      <EditAccountModal
        isOpen={showEditModal}
        authUsers={authUsers}
        authUsersAll={authUsersAll}
        selectedToEditAccount={selectedAccount}
        departmentList={departmentList}
        employmentStatus={employmentStatus}
        onClose={handleCloseModal}
        onSuccess={handleCloseEdit}
      />
    </div>
  );
};

export default EmployeeManagement;