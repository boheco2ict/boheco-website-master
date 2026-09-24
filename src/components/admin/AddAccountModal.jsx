import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../../services/supabase";
import { createEmployee, createEmployeeInfo } from "../../services/postservices";

const AddAccountModal = ({ open, onClose, onSuccess}) => {
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    try {
      setSaving(true);
      const { data, error } = await supabase.functions.invoke(
        "create-user",
        {
          body: {
            email: form.email.trim(),
            password: form.password.trim(),
          },
        }
      );

      if (error) {
        throw error;
      }

      if (data?.user) {
        addAccount(data);
      }
    } catch (error) {
      console.error(error);
      alert("Email Already Exist.");
    } finally {
      setSaving(false);
    }
  };

  const addAccount = async (data) => {
    try {
      const resData = await createEmployee(data?.user?.id);
      const resData1 = await createEmployeeInfo(resData?.id);
      if (data && resData && resData1) {
        alert("Account Created Successfully.");
        resetForm();
        onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = () => {
    if (saving) return;
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Create Employee Account
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Create the login credentials for the employee.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Password <span className="text-red-500">*</span>
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Confirm Password{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;