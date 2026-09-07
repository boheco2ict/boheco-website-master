import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabase";
import { createConsumerAccountBinding } from "../../services/postservices";
import { deleteConsumerBindAccount } from "../../services/deleteservices";
import {
  FaTimes,
  FaUserCog,
  FaHashtag,
  FaPlus,
  FaTrash,
  FaSave,
  FaMoneyBillWave,
  FaCalendarAlt,
} from "react-icons/fa";

const ManageAccount = ({ isOpen, onClose }) => {
  const { consumerInfo, loading: authLoading } = useAuth();
  const [accountList, setAccountList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from(
    { length: 10 },
    (_, index) => new Date().getFullYear() - index
  );

  useEffect(() => {
    if (authLoading || !consumerInfo || !isOpen) return;

    setAccountList(
      consumerInfo?.consumers_boheco_account || []
    );
  }, [isOpen, consumerInfo, authLoading]);

  if (!isOpen) return null;

  const resetForm = () => {
    setAccountNumber("");
    setAmount("");
    setMonth("");
    setYear("");
    setError("");
  };

  const handleAdd = async () => {
    if (!accountNumber.trim()) {
      setError("Please enter the account number.");
      return;
    }

    if (!amount) { 
      setError("Please enter the exact amount.");
      return;
    }

    if (!month) {
      setError("Please select a month.");
      return;
    }

    if (!year) {
      setError("Please select a year.");
      return;
    }

    if (!consumerInfo?.id) {
      setError("Consumer ID is Unavailable.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const addResponse = await createConsumerAccountBinding(consumerInfo.id, accountNumber, month, year, amount);

      if (addResponse.success) {
        resetForm();
        setShowAddForm(false);
        if (addResponse?.data) {
          const updatedAccounts = [...accountList, addResponse.data];
          setAccountList(updatedAccounts);
        }
      } else {
        resetForm();
      }
      alert(addResponse.message);
    } catch (err) {
      console.error("Add Account Error:", err);
      setError("Something went wrong while adding the account.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError("");

      const deleteResponse = await deleteConsumerBindAccount(id);

      if (deleteResponse.success) {
        const updatedAccounts = accountList.filter(
          (account) => account.id !== id
        );
        setAccountList(updatedAccounts);
      }
      alert(deleteResponse.message);
    } catch (err) {
      console.error("Delete Account Error:", err);
      setError("Something went wrong while deleting the account.");
    } finally {
      setLoading(false);
    }
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
              <FaUserCog />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Manage Accounts
              </h2>

              <p className="text-xs text-slate-500">
                Manage your registered BOHECO accounts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {showAddForm ? (
            <>
              <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-800">
                  Add Account
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the account billing information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Account Number */}
                <FormInput
                  label="Account Number"
                  value={accountNumber}
                  type="number"
                  onChange={(e) => setAccountNumber(e.target.value)}
                  icon={<FaHashtag />}
                />

                {/* Amount */}
                <FormInput
                  label="Exact Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  icon={<FaMoneyBillWave />}
                />

                {/* Month */}
                <FormSelect
                  label="Billing Month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  icon={<FaCalendarAlt />}
                  options={months}
                  placeholder="Select Month"
                />

                {/* Year */}
                <FormSelect
                  label="Billing Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  icon={<FaCalendarAlt />}
                  options={years.map((value) => ({
                    value,
                    label: value,
                  }))}
                  placeholder="Select Year"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeAddForm}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaSave className="text-xs" />
                  {loading ? "Adding..." : "Add Account"}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Account Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Registered Accounts
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {accountList.length} account
                    {accountList.length !== 1 ? "s" : ""} registered
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowAddForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <FaPlus className="text-xs" />
                  Add Account
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Accounts */}
              {accountList.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-600">
                    No accounts found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add an account to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {accountList.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
                    >
                      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Account Number */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                            <FaHashtag className="text-xs" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Account Number
                            </p>

                            <p className="truncate text-sm font-bold text-slate-800">
                              {account.account_number || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Account Name */}
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <FaUserCog className="text-xs" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Account Name
                            </p>

                            <p className="truncate text-sm font-bold text-slate-800">
                              {account.account_name || "—"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(account.id)}
                        disabled={loading }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete Account"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  value,
  onChange,
  icon,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </label>

    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-orange-400">
        {icon}
      </span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      />
    </div>
  </div>
);

const FormSelect = ({
  label,
  value,
  onChange,
  icon,
  options,
  placeholder,
}) => (
  <div>
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
      {label}
    </label>

    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-orange-400">
        {icon}
      </span>

      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        
      </select>
    </div>
  </div>
);

export default ManageAccount;