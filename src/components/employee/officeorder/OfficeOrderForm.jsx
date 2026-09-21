function OfficeOrderForm({
  officeOrderName,
  setOfficeOrderName,
  officeOrderDescription,
  setOfficeOrderDescription,
  officeOrderUrl,
  setOfficeOrderUrl,
  recipientType,
  setRecipientType,
  departmentFilter,
  setDepartmentFilter,
  individualTarget,
  setIndividualTarget,
  batchTarget,
  setBatchTarget,
  allEmployee,
  setBatchEmployeeIds,
  getDepartmentName,
  submitLoading,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        {/* OFFICE ORDER NAME */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Office Order Name
          </label>

          <input
            type="text"
            value={officeOrderName}
            onChange={(event) => setOfficeOrderName(event.target.value)}
            placeholder="Enter office order name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
        {/* OFFICE ORDER DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Office Order Description
          </label>

          <input
            type="text"
            value={officeOrderDescription}
            onChange={(event) =>
              setOfficeOrderDescription(event.target.value)
            }
            placeholder="Enter office order description"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
        {/* OFFICE ORDER URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Office Order URL
          </label>

          <input
            type="url"
            value={officeOrderUrl}
            onChange={(event) => setOfficeOrderUrl(event.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* RECIPIENT */}
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Send Office Order To
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {/* SPECIFIC EMPLOYEE */}
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
              <input
                type="radio"
                checked={recipientType === "individual"}
                onChange={() => setRecipientType("individual")}
                className="h-4 w-4"
              />
              Specific Employee
            </label>

            {/* BATCH */}
            <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
              <input
                type="radio"
                checked={recipientType === "batch"}
                onChange={() => setRecipientType("batch")}
                className="h-4 w-4"
              />
              Batch Send
            </label>
          </div>

          {recipientType === "individual" ? (
            <div className="mt-4">
              {/* Department Filter */}
              <label className="block text-sm font-semibold text-slate-700">
                Department
              </label>

              <select
                value={departmentFilter}
                onChange={(event) => {
                  setDepartmentFilter(event.target.value);
                  setIndividualTarget("");
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              >
                <option value="">All Departments</option>

                {[
                  ...new Set(
                    allEmployee
                      ?.map((employeeT) => employeeT.department)
                      .filter(Boolean)
                  ),
                ]
                  .sort()
                  .map((department) => (
                    <option key={department} value={department}>
                      {getDepartmentName(department)}
                    </option>
                  ))}
              </select>

              {/* Employee */}
              <label className="mt-4 block text-sm font-semibold text-slate-700">
                Employee
              </label>
              <select
                value={individualTarget || ""}
                onChange={(event) => setIndividualTarget(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              >
                <option value="">Please Select Employee</option>

                {allEmployee
                  ?.filter(
                    (employeeT) =>
                      !departmentFilter ||
                      employeeT.department === departmentFilter
                  )
                  .map((employeeT) => (
                    <option key={employeeT.id} value={employeeT.id}>
                      {employeeT.lastname}, {employeeT.firstname}{" "}
                      {employeeT.middlename
                        ? `${employeeT.middlename.charAt(0).toUpperCase()}.`
                        : ""}
                    </option>
                  ))}
              </select>
            </div>
          ) : (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700">
                Batch Target
              </label>

              <select
                value={batchTarget}
                onChange={(event) => {
                  const selectedDepartment = event.target.value;

                  setBatchTarget(selectedDepartment);

                  let employeeIds;

                  if (selectedDepartment === "all") {
                    // Get ALL employee IDs
                    employeeIds = allEmployee.map((employee) => employee.id);
                  } else {
                    // Get IDs belonging to the selected department
                    employeeIds = allEmployee
                      .filter(
                        (employee) => employee.department === selectedDepartment
                      )
                      .map((employee) => employee.id);
                  }
                  setBatchEmployeeIds(employeeIds);
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
              >
                <option value="all">All Departments</option>

                {[
                  ...new Set(
                    allEmployee
                      ?.map((employee) => employee.department)
                      .filter(Boolean)
                  ),
                ]
                  .sort()
                  .map((department) => (
                    <option key={department} value={department}>
                      {getDepartmentName(department)}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* FORM BUTTONS */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitLoading}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-700"
        >
          Send Office Order
        </button>
      </div>
    </form>
  );
}

export default OfficeOrderForm;
