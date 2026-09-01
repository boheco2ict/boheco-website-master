import { useEffect, useMemo, useState } from "react";

import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUser,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import {
  getAllEmployees,
  getDepartmentMeaning,
  getAllAuthUsers,
} from "../../services/getservices";

import {
  updateEmployee,
} from "../../services/updateservices";

import {
  createEmployee,
} from "../../services/postservices";

import {
  deleteEmployee,
} from "../../services/deleteservices";

const EMPTY_EMPLOYEE = {
  user_id: "",
  empnumber: "",
  lastname: "",
  firstname: "",
  middlename: "",
  department: "",
  address: "",
  phone1: "",
  phone2: "",
  birthdate: "",
  tin: "",
  sss: "",
  pagibig: "",
  philhealth: "",
  empstatus: "",
  position: "",
  datehired: "",
  basicrate: "",
  riceallowance: "",
  role: "USER",
};

const EmployeeManagement = () => {
  const { employeeInfo } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departmentMeaning, setDepartmentMeaning] = useState([]);
  const [authUsers, setAuthUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState(EMPTY_EMPLOYEE);

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  /*
  |--------------------------------------------------------------------------
  | LOAD EMPLOYEES
  |--------------------------------------------------------------------------
  */

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const [authUsersData, employeesData, departmentData] = await Promise.all([getAllAuthUsers(), getAllEmployees(), getDepartmentMeaning()]);

      const filteredEmployees = (employeesData || []).filter( //Remove my own record
        (employee) => employee.id !== employeeInfo?.id
      );
      const filteredAuthUsers = (authUsersData || []).filter( //Remove my own record
        (authuser) => authuser.id !== employeeInfo?.user_id
      );

      setEmployees(filteredEmployees || []);
      setDepartmentMeaning(departmentData || []);
      setAuthUsers(filteredAuthUsers || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  |--------------------------------------------------------------------------
  | RESET PAGE WHEN SEARCH/FILTER CHANGES
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, departmentFilter, statusFilter,]);
  /*
  |--------------------------------------------------------------------------
  | FULL NAME
  |--------------------------------------------------------------------------
  */
  const getFullName = (employee) => {
    const middleInitial = employee.middlename ? `${employee.middlename.charAt(0)}.` : "";
    return [employee.firstname, middleInitial, employee.lastname].filter(Boolean).join(" ");
  };
  /*
  |--------------------------------------------------------------------------
  | FILTER EMPLOYEES
  |--------------------------------------------------------------------------
  */
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const fullName = getFullName(employee).toLowerCase();
      const employeeNumber = String(employee.empnumber || "").toLowerCase();
      const position = String(employee.position || "").toLowerCase();
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        employeeNumber.includes(searchValue) ||
        position.includes(searchValue);

      const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
      const matchesStatus = !statusFilter || employee.empstatus === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, search, departmentFilter, statusFilter]);
  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  /*
  |--------------------------------------------------------------------------
  | OPEN ADD MODAL
  |--------------------------------------------------------------------------
  */
  const openAddModal = () => {
    setEditingEmployee(null);
    setForm({...EMPTY_EMPLOYEE,});
    setShowModal(true);
  };
  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT MODAL
  |--------------------------------------------------------------------------
  */
  const openEditModal = (employee) => {
    setEditingEmployee(employee);

    setForm({
      ...EMPTY_EMPLOYEE,
      ...employee,
      birthdate: employee.birthdate || "",
      datehired: employee.datehired || "",
      basicrate: employee.basicrate ?? "",
      riceallowance: employee.riceallowance ?? "",
    });

    setShowModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE MODAL
  |--------------------------------------------------------------------------
  */
  const closeModal = () => {
    if (saving) return;
    setShowModal(false);
    setEditingEmployee(null);
    setForm({...EMPTY_EMPLOYEE,});
  };
  /*
  |--------------------------------------------------------------------------
  | HANDLE INPUT
  |--------------------------------------------------------------------------
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };
  /*
  |--------------------------------------------------------------------------
  | HANDLE DEPARTMENT
  |--------------------------------------------------------------------------
  */
  const handleDepartmentChange = (e) => {
    setForm(current => ({
      ...current,
      department: e.target.value,
    }));
  };
  /*
  |--------------------------------------------------------------------------
  | PREPARE EMPLOYEE DATA
  |--------------------------------------------------------------------------
  */
  const prepareEmployeeData = () => {
    return {
      user_id: form.user_id || null,
      empnumber: form.empnumber.trim(),
      lastname: form.lastname.trim(),
      firstname: form.firstname.trim(),
      middlename: form.middlename?.trim() || null,
      department: form.department,
      address: form.address?.trim() || null,
      phone1: form.phone1?.trim() || null,
      phone2: form.phone2?.trim() || null,
      birthdate: form.birthdate || null,
      tin: form.tin?.trim() || null,
      sss: form.sss?.trim() || null,
      pagibig: form.pagibig?.trim() || null,
      philhealth: form.philhealth?.trim() || null,
      empstatus: form.empstatus || null,
      position: form.position?.trim() || null,
      datehired: form.datehired || null,
      basicrate: form.basicrate === "" ? null : Number(form.basicrate),
      riceallowance: form.riceallowance === "" ? null : Number(form.riceallowance),
      role: form.role || "USER",
    };
  };
  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeData = prepareEmployeeData();
    try {
      setSaving(true);
      let result;

      if (editingEmployee) {
        result = await updateEmployee(editingEmployee.id, employeeData);
      } else {
        // Check if selected auth user already has an employee record
        const userAlreadyExists = (employees || []).some(
          (employee) => employee.user_id === form.user_id
        );

        // Check if employee number already exists
        const empNumberAlreadyExists = (employees || []).some(
          (employee) => employee.empnumber === form.empnumber
        );

        // Stop submission if user ID already exists
        if (userAlreadyExists) {
          alert("This user already has an employee record.");
          return;
        }

        // Stop submission if employee number already exists
        if (empNumberAlreadyExists) {
          alert("Employee number already exists.");
          return;
        }
        result = await createEmployee(employeeData);
      }

      if (result.success) {
        alert(result.message);
        closeModal();
        await loadEmployees();
      } else {
        alert(result.message);
      }
      
    } catch (error) {
      console.error("Save employee error:", error);
      alert("An unexpected error occurred while saving the employee.");
    } finally {
      setSaving(false);
    }
  };
  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (employee) => {
    const fullName = getFullName(employee);
    const confirmed = window.confirm(`Are you sure you want to delete ${fullName}?`);

    if (!confirmed) return;

    try {
      const result = await deleteEmployee(employee.id);

      if (!result.success) {
        alert(result.message);
        return;
      }

      alert(result.message);
      await loadEmployees();
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee.");
    }
  };

  /* STATUS LABEL */
  const getStatusLabel = (status) => {
    switch (status) {
      case "R": return "Regular";
      case "P": return "Probationary";
      case "C": return "Contractual";
      default: return status || "Unknown";
    }
  };

  /* STATUS STYLE */
  const getStatusStyle = (status) => {
    switch (status) {
      case "R": return "bg-emerald-50 text-emerald-600";
      case "P": return "bg-amber-50 text-amber-600";
      case "C": return "bg-blue-50 text-blue-600";
      default: return "bg-slate-100 text-slate-500";
    }
  };
  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div className="min-h-screen w-full" style={{ background: "var(--section-bg)" }}>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.15em] text-slate-400">ADMINISTRATION</span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-800">Employee Management</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Manage employee records, department assignments, employment information, and account details.
              </p>
            </div>
          </div>

          <button type="button" onClick={openAddModal} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98]">
            <FaPlus className="text-xs" /> Add Employee
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, number, or position..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="">All Departments</option>
            {departmentMeaning.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="R">Regular</option>
            <option value="P">Probationary</option>
            <option value="C">Contractual</option>
          </select>
        </div>

        <div className="border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-600">{filteredEmployees.length}</span>{" "}
            Employee{filteredEmployees.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Employee</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Employee No.</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Position</th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-sm text-slate-400">Loading employees...</td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                      <FaUser />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-600">No employees found</p>
                    <p className="mt-1 text-xs text-slate-400">Try changing your search or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <FaUser className="text-xs" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{getFullName(employee)}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{employee.role || "USER"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">{employee.empnumber || "—"}</td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-700">{employee.department || "—"}</p>
                      <p className="mt-0.5 max-w-[250px] text-xs text-slate-400"></p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">{employee.position || "—"}</td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyle(employee.empstatus)}`}>
                        {getStatusLabel(employee.empstatus)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(employee)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Edit employee"
                        >
                          <FaEdit className="text-xs" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(employee)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete employee"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-400">
              Page <span className="font-semibold text-slate-600">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-600">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingEmployee ? "Edit Employee" : "Add Employee"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {editingEmployee ? "Update the employee information below." : "Enter the employee information below."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="space-y-6 p-6">
                {/* PERSONAL INFORMATION */}
                <section className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <h3 className="text-sm font-bold text-slate-800">Personal Information</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Enter the employee's basic identification details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        UUID <span className="text-red-500">*</span>
                      </label>

                      <select
                        name="user_id"
                        value={form.user_id ?? ""}
                        required
                        onChange={handleChange}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select User Account</option>

                        {authUsers.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input label="First Name" name="firstname" value={form.firstname} onChange={handleChange} required />
                    <Input label="Middle Name" name="middlename" value={form.middlename} onChange={handleChange} />
                    <Input label="Last Name" name="lastname" value={form.lastname} onChange={handleChange} required />
                    <Input label="Birthdate" name="birthdate" required type="date" value={form.birthdate} onChange={handleChange} />
                    <Input label="Address" name="address" required value={form.address} onChange={handleChange} />
                    <Input label="Phone 1" name="phone1" required value={form.phone1} onChange={handleChange} />
                    <Input label="Phone 2" name="phone2" value={form.phone2} onChange={handleChange} />
                  </div>
                </section>

                {/* EMPLOYMENT INFORMATION */}
                <section className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <h3 className="text-sm font-bold text-slate-800">Employment Information</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Provide employment status, position, and hiring information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <SelectInput
                      label="Employee Status"
                      name="empstatus"
                      value={form.empstatus}
                      required
                      onChange={handleChange}
                      options={[
                        { value: "R", label: "Regular" },
                        { value: "P", label: "Probationary" },
                        { value: "C", label: "Contractual" },
                      ]}
                    />
                    <Input label="Position" name="position" value={form.position} onChange={handleChange} required />
                    <Input label="Date Hired" name="datehired" required type="date" value={form.datehired} onChange={handleChange} />

                    <SelectInput
                      label="Role"
                      name="role"
                      value={form.role}
                      required
                      onChange={handleChange}
                      options={[
                        { value: "USER", label: "User" },
                        { value: "ADMIN", label: "Admin" },
                        { value: "HR", label: "HR" },
                        { value: "EDITOR", label: "Editor" },
                      ]}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Department <span className="text-red-500">*</span>
                      </label>

                      <select
                        value={form.department}
                        onChange={handleDepartmentChange}
                        required
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select Department</option>

                        {departmentMeaning.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} - {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input label="Employee Number" name="empnumber" value={form.empnumber} onChange={handleChange} required />
                  </div>
                </section>

                {/* GOVERNMENT INFORMATION */}
                <section className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <h3 className="text-sm font-bold text-slate-800">Government Information</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Enter the employee's government identification information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <Input label="TIN" name="tin" value={form.tin} onChange={handleChange} />
                    <Input label="SSS" name="sss" value={form.sss} onChange={handleChange} />
                    <Input label="Pag-IBIG" name="pagibig" value={form.pagibig} onChange={handleChange} />
                    <Input label="PhilHealth" name="philhealth" value={form.philhealth} onChange={handleChange} />
                  </div>
                </section>

                {/* COMPENSATION INFORMATION */}
                <section className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <h3 className="text-sm font-bold text-slate-800">Compensation</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Enter the employee's salary and allowance information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                    <Input label="Basic Rate" name="basicrate" type="number" value={form.basicrate} onChange={handleChange} />
                    <Input label="Rice Allowance" name="riceallowance" type="number" value={form.riceallowance} onChange={handleChange} />
                    
                  </div>
                </section>
              </div>

              {/* FORM ACTIONS */}
              <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-slate-200 bg-white/95 px-6 py-4 shadow-[0_-4px_12px_rgba(15,23,42,0.04)] backdrop-blur">
                <p className="hidden text-xs text-slate-400 sm:block">
                  <span className="text-red-500">*</span> Required fields
                </p>

                <div className="ml-auto flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingEmployee ? "Save Changes" : "Add Employee"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
/*
|--------------------------------------------------------------------------
| INPUT COMPONENT
|--------------------------------------------------------------------------
*/
const Input = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
};

/* SELECT COMPONENT */
const SelectInput = ({ label, name, value, onChange, required = false, options }) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ""}
        required={required}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default EmployeeManagement;