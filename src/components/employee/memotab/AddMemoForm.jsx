import { useEffect, useState } from "react";
import { createMemo } from "../../../services/postservices";

function AddMemoForm({
  allEmployee,
  getDepartmentName,
  employeeId,
  onSent,
  onCancel,
  onClearMessage,
}) {
  const [memoName, setMemoName] = useState("");
  const [memoDescription, setMemoDescription] = useState("");
  const [memoUrl, setMemoUrl] = useState("");
  const [recipientType, setRecipientType] = useState("individual");
  const [individualTarget, setIndividualTarget] = useState("");
  const [batchTarget, setBatchTarget] = useState("All");
  const [batchEmployeeIds, setBatchEmployeeIds] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (allEmployee?.length > 0 && batchTarget === "All") {
      const allIds = allEmployee.map((employee) => employee.id);
      setBatchEmployeeIds(allIds);
    }
  }, [allEmployee, batchTarget]);

  // =========================================================
  // RESET MEMO FORM
  // =========================================================
  const resetMemoForm = () => {
    setMemoName("");
    setMemoUrl("");
    setRecipientType("individual");
    setIndividualTarget("");
    setBatchTarget("All");
    onClearMessage();
    setMemoDescription("");
  };

  // =========================================================
  // SEND MEMO
  // =========================================================
  const handleSendMemo = async (event) => {
    event.preventDefault();
    if (memoName.trim().length === 0) {
      alert("Please Enter Memo Name.");
      return;
    }
    if (memoDescription.trim().length === 0) {
      alert("Please Enter Memo Description.");
      return;
    }
    if (memoUrl.trim().length === 0) {
      alert("Please Enter Memo URL.");
      return;
    }
    if (recipientType === "individual") {
      if (individualTarget.trim().length === 0) {
        alert("Please Select a Individual Recipient.");
        return;
      }
    }
    if (recipientType === "batch") {
      if (!batchEmployeeIds || batchEmployeeIds.length === 0) {
        alert("Please Select a Batch Recipient.");
        return;
      }
    }

    const confirmed = window.confirm(
      "Are you sure you want to send this Memo?"
    );
    if (!confirmed) return;
    setSubmitLoading(true);

    try {
      const response = await createMemo(
        memoName,
        memoDescription,
        memoUrl,
        individualTarget,
        batchEmployeeIds,
        recipientType,
        employeeId
      );
      if (response) {
        onSent();
        resetMemoForm();
        alert("Memo Sent Successfully.");
      } else {
        alert("Failed to Send Memo.");
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

  return (
    <form
      onSubmit={handleSendMemo}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        {/* MEMO NAME */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Memo Name
          </label>

          <input
            type="text"
            value={memoName}
            onChange={(event) => setMemoName(event.target.value)}
            placeholder="Enter memo name"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
        {/* MEMO DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Memo Description
          </label>

          <input
            type="text"
            value={memoDescription}
            onChange={(event) => setMemoDescription(event.target.value)}
            placeholder="Enter memo description"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>
        {/* MEMO URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-700">
            Memo URL
          </label>

          <input
            type="url"
            value={memoUrl}
            onChange={(event) => setMemoUrl(event.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
          />
        </div>

        {/* RECIPIENT */}
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Send Memo To</p>

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
          onClick={() => {
            resetMemoForm();
            onCancel();
          }}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitLoading}
          className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-amber-700"
        >
          Send Memo
        </button>
      </div>
    </form>
  );
}

export default AddMemoForm;
