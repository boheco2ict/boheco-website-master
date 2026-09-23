import { useEffect, useState } from "react";
import { FaTimes, FaSave, FaUserShield, FaIdBadge } from "react-icons/fa";

const EditAccountModal = ({ isOpen, onClose, account, authUsers, onSave }) => {
  const [formData, setFormData] = useState({
    role: "",
    isActive: true,
    user_id: "",

    firstname: "",
    middlename: "",
    lastname: "",
    address: "",
    birthdate: "",
    department: "",
    empnumber: "",
    empstatus: "",
    position: "",
    basicrate: "",
    riceallowance: "",
    tin: "",
    sss: "",
    philhealth: "",
    datehired: "",
    pagibig: "",
    phone1: "",
    phone2: "",
  });

  useEffect(() => {
    if (!account) return;
    if (!authUsers) return;
    console.log(authUsers);
    const employee = account.employee;
    setFormData({
      role: account.role || "",
      isActive: account.isActive ?? true,
      user_id: account.user_id || "",

      firstname: employee.firstname || "",
      middlename: employee.middlename || "",
      lastname: employee.lastname || "",
      address: employee.address || "",
      birthdate: employee.birthdate || "",
      department: employee.department || "",
      empnumber: employee.empnumber || "",
      empstatus: employee.empstatus || "",
      position: employee.position || "",
      basicrate: employee.basicrate || "",
      riceallowance: employee.riceallowance || "",
      tin: employee.tin || "",
      sss: employee.sss || "",
      philhealth: employee.philhealth || "",
      datehired: employee.datehired || "",
      pagibig: employee.pagibig || "",
      phone1: employee.phone1 || "",
      phone2: employee.phone2 || "",
    });
  }, [account]);

  if (!isOpen || !account) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      id: {
        account: account.id,
        employee: account.employee.id
      },
      account: {
        role: formData.role,
        isActive: formData.isActive,
        user_id: formData.user_id,
      },
      employee: {
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        address: formData.address,
        birthdate: formData.birthdate,
        department: formData.department,
        empnumber: formData.empnumber,
        empstatus: formData.empstatus,
        position: formData.position,
        basicrate: formData.basicrate,
        riceallowance: formData.riceallowance,
        tin: formData.tin,
        sss: formData.sss,
        philhealth: formData.philhealth,
        datehired: formData.datehired,
        pagibig: formData.pagibig,
        phone1: formData.phone1,
        phone2: formData.phone2,
      },
    };

    onSave(updatedData);
  };

  // shared input classes
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-slate-400";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <FaUserShield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Edit Account
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 active:scale-95"
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-6 py-6"
        >
          {/* ================= ACCOUNT ================= */}
          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaUserShield className="h-3.5 w-3.5 text-blue-500" />
              Account Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* User ID */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  User ID / Email
                </label>

                {account.user_id ? (
                  // Existing user ID - cannot be changed
                  <input
                    type="text"
                    value={account.user_id}
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                ) : (
                  // No user ID yet - allow selecting an auth user
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">
                      Please Select
                    </option>

                    {authUsers?.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.email} - {user.id} 
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Role */}
              <div>
                <label className={labelClass}>
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClass + " cursor-pointer"}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="HR">HR</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="CONSUMER">CONSUMER</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={labelClass}>
                  Account Status
                </label>

                <label className="flex h-[42px] cursor-pointer items-center gap-3 rounded-lg border border-slate-300 bg-slate-50/60 px-3.5 transition-colors hover:border-slate-400">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30"
                  />

                  <span
                    className={
                      "text-sm font-medium " +
                      (formData.isActive
                        ? "text-emerald-600"
                        : "text-slate-500")
                    }
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ================= EMPLOYEE ================= */}
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FaIdBadge className="h-3.5 w-3.5 text-blue-500" />
              Employee Information
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* First Name */}
              <div>
                <label className={labelClass}>
                  First Name
                </label>

                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="First name"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className={labelClass}>
                  Middle Name
                </label>

                <input
                  type="text"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Middle name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className={labelClass}>
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Last name"
                />
              </div>

              {/* Employee Number */}
              <div>
                <label className={labelClass}>
                  Employee Number
                </label>

                <input
                  type="number"
                  name="empnumber"
                  value={formData.empnumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Birthdate */}
              <div>
                <label className={labelClass}>
                  Birthdate
                </label>

                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Department */}
              <div>
                <label className={labelClass}>
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Position */}
              <div className="md:col-span-2">
                <label className={labelClass}>
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Employment Status */}
              <div>
                <label className={labelClass}>
                  Employment Status
                </label>

                <input
                  type="text"
                  name="empstatus"
                  value={formData.empstatus}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-3">
                <label className={labelClass}>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Basic Rate */}
              <div>
                <label className={labelClass}>
                  Basic Rate
                </label>

                <input
                  type="number"
                  name="basicrate"
                  value={formData.basicrate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Rice Allowance */}
              <div>
                <label className={labelClass}>
                  Rice Allowance
                </label>

                <input
                  type="number"
                  name="riceallowance"
                  value={formData.riceallowance}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* TIN */}
              <div>
                <label className={labelClass}>
                  TIN
                </label>

                <input
                  type="text"
                  name="tin"
                  value={formData.tin}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* SSS */}
              <div>
                <label className={labelClass}>
                  SSS
                </label>

                <input
                  type="text"
                  name="sss"
                  value={formData.sss}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* PhilHealth */}
              <div>
                <label className={labelClass}>
                  PhilHealth
                </label>

                <input
                  type="text"
                  name="philhealth"
                  value={formData.philhealth}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Pag-IBIG */}
              <div>
                <label className={labelClass}>
                  Pag-IBIG
                </label>

                <input
                  type="text"
                  name="pagibig"
                  value={formData.pagibig}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Phone 1 */}
              <div>
                <label className={labelClass}>
                  Phone 1
                </label>

                <input
                  type="text"
                  name="phone1"
                  value={formData.phone1}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Phone 2 */}
              <div>
                <label className={labelClass}>
                  Phone 2
                </label>

                <input
                  type="text"
                  name="phone2"
                  value={formData.phone2}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Date Hired */}
              <div>
                <label className={labelClass}>
                  Date Hired
                </label>

                <input
                  type="date"
                  name="datehired"
                  value={formData.datehired}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-150 hover:border-slate-400 hover:bg-slate-50 active:scale-[0.98]"
          >
            Cancel
          </button>

          <button
            type="submit"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            <FaSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
