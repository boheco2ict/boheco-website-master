import { useState } from "react";

const EmployeeForm = ({ ID, onSuccess }) => {
  const [form, setForm] = useState({
    uuid: ID || "",
    firstname: "",
    middlename: "",
    lastname: "",
    role: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-800 to-slate-700">
          <h2 className="text-2xl font-semibold text-white">
            Employee Information
          </h2>

          <p className="mt-1 text-sm text-slate-300">
            Please provide your personal information to continue.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstname"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                First Name
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                id="firstname"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                placeholder="Enter first name"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="middlename"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Middle Name
              </label>

              <input
                type="text"
                id="middlename"
                name="middlename"
                value={form.middlename}
                onChange={handleChange}
                placeholder="Enter middle name"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              />
            </div>

            {/* Last Name */}
            <div className="md:col-span-2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Last Name
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                type="text"
                id="lastname"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Enter last name"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 hover:border-slate-400"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:scale-[0.98]"
            >
              Save Information
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;