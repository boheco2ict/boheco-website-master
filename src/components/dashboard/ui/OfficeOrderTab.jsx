import { useEffect, useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import EmptyState from "./EmptyState";
import FormatDate from "./FormatDate";
import Pagination from "../../Pagination";
import {
  getAllEmployees,
  getMyAssignOfficeOrder,
  getDepartmentMeaning
} from "../../../services/getservices";
import {
  createOfficeOrder
} from "../../../services/postservices";
import {
  markAsReadOfficeOrder
} from "../../../services/updateservices";

function OfficeOrderTab({employee}) {
  const canISendMemo = employee.role === "HR";
  const [officeOrderMode, setOfficeOrderMode] = useState("view");
  const [officeOrderName, setOfficeOrderName] = useState("");
  const [officeOrderDescription, setOfficeOrderDescription] = useState("");
  const [officeOrderUrl, setOfficeOrderUrl] = useState("");
  const [recipientType, setRecipientType] = useState("individual");
  const [individualTarget, setIndividualTarget] = useState("");
  const [batchTarget, setBatchTarget] = useState("All");
  const [allEmployee, setAllEmployee] = useState("");
  const [officeOrderMessage, setOfficeOrderMessage] = useState("");
  const [batchEmployeeIds, setBatchEmployeeIds] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isOfficeOrderLoading, setIsOfficeOrderLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [myAssignOfficeOrder, setMyAssignOfficeOrder] = useState([]);
  const [markingOfficeOrderId, setMarkingOfficeOrderId] = useState(null);
  const [departmentMeaning, setDepartmentMeaning] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(
    myAssignOfficeOrder.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMemos = myAssignOfficeOrder.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  useEffect(() => {
    const fetch = async () => {
      try {
        setIsOfficeOrderLoading(true);
        const response = await getMyAssignOfficeOrder(employee.id);
        setMyAssignOfficeOrder(response);
      } catch (error) {
        console.error("Error fetching my assign office order: ", error);
      } finally {
        setIsOfficeOrderLoading(false);
      }
    };
    
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, employee?.role]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const employeeData = await getAllEmployees();
        setAllEmployee(employeeData);
      } catch (error) {
         setAllEmployee("");
        console.error("Error fetching employee: ", error);
      }
    };

    fetch();
  }, [employee]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDepartmentMeaning();
        setDepartmentMeaning(data);
      } catch (error) {
        setDepartmentMeaning("");
        console.error("Error fetching department meaning: ", error);
      }
    };

    fetch();
  }, [employee]);

  useEffect(() => {
    if (allEmployee?.length > 0 && batchTarget === "All") {
      const allIds = allEmployee.map(
        (employee) => employee.id
      );
      setBatchEmployeeIds(allIds);
    }
  }, [allEmployee, batchTarget]);
  // =========================================================
  // RESET OFFICE ORDER FORM
  // =========================================================
  const resetMemoForm = () => {
    setOfficeOrderName("");
    setOfficeOrderUrl("");
    setRecipientType("individual");
    setIndividualTarget("");
    setBatchTarget("All");
    setOfficeOrderMessage("");
    setOfficeOrderDescription("");
  };

  // =========================================================
  // SEND OFFICE ORDER
  // =========================================================
const handleSendMemo = async (event) => {
  event.preventDefault();
  if (officeOrderName.trim().length === 0) {
    alert("Please enter office order name.");
    return;
  }
  if (officeOrderDescription.trim().length === 0) {
    alert("Please enter office order description.");
    return;
  }
  if (officeOrderUrl.trim().length === 0) {
    alert("Please enter office order URL.");
    return;
  }
  if (recipientType === "individual") {
    if (individualTarget.trim().length === 0) {
      alert("Please select individual recipient.");
      return;
    }
  }
  if (recipientType === "batch") {
    if (!batchEmployeeIds || batchEmployeeIds.length === 0) {
      alert("Please select a batch recipient.");
      return;
    }
  }

  const confirmed = window.confirm(
    "Are you sure you want to send this office order?"
  );
  if (!confirmed) return;
  setSubmitLoading(true);

  try {
    const response = await createOfficeOrder(
      officeOrderName,
      officeOrderDescription,
      officeOrderUrl,
      individualTarget,
      batchEmployeeIds,
      recipientType,
      employee.id
    );
    setOfficeOrderMessage("Office Order Sent Successfully.");
    setOfficeOrderMode("view");
    console.log("create office order response", response);
    resetMemoForm();
  } catch (error) {
    console.error("Error sending office order:", error);
    setOfficeOrderMessage(
      error?.message || "Failed to send office order."
    );
  } finally {
    setSubmitLoading(false);
  }
};
  // =========================================================
  // MARK OFFICE ORDER AS READ
  // =========================================================
  const handleOpenMemo = async (officeOrderData) => {
    if (!officeOrderData) {
      alert("No office order data available.");
      return;
    }
    if (officeOrderData.url) {
      if (officeOrderData.is_read === false) {
        handleMarkAsRead(officeOrderData);
      }
      window.open(officeOrderData.url, "_blank", "noopener,noreferrer");
    }
  }
  const handleMarkAsRead = async (officeOrderData) => {
    if (!officeOrderData) {
      alert("No office order data available.");
      return;
    }

    if (officeOrderData.is_read) return;

    try {
      setMarkingOfficeOrderId(officeOrderData.id);
      const response = await markAsReadOfficeOrder(officeOrderData);
      console.log("mark as read", response);
      if (response.success) {
        // Update the office order in the UI immediately
        setMyAssignOfficeOrder((prevMemos) =>
          prevMemos.map((officeorder) =>
            officeorder.id === officeOrderData.id
              ? {
                  ...officeorder,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }
              : officeorder
          )
        );
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      setOfficeOrderMessage(
        error?.message || "Failed to mark as read."
      );
    } finally {
      setMarkingOfficeOrderId(null);
    }
  };
  const getDepartmentName = (departmentCode) => {
    if (!departmentCode || !departmentMeaning?.length) {
      return departmentCode || "Unknown Department";
    }
    const department = departmentMeaning.find(
      (item) => item.code === departmentCode
    );
    return department?.name || departmentCode;
  };
  return (
    <div className="space-y-5">
      {canISendMemo && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Office Orders
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Employee Office Orders Management
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Paste a Google Drive office order URL, then choose a
                specific employee or a batch to send.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOfficeOrderMessage("");
                setOfficeOrderMode("add");
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Add Office Order
            </button>
          </div>
        </div>
      )}

      {officeOrderMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {officeOrderMessage}
        </div>
      )}
      {officeOrderMode === "add" && !canISendMemo ? (
        <EmptyState
          icon={FaRegFileAlt}
          title="Access denied"
          message="Only HR can add Memos."
        />
      ) : officeOrderMode === "add" ? (
        <form
          onSubmit={handleSendMemo}
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
                onChange={(event) =>
                  setOfficeOrderName(event.target.value)
                }
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
                onChange={(event) =>
                  setOfficeOrderUrl(event.target.value)
                }
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
                    checked={
                      recipientType === "individual"
                    }
                    onChange={() =>
                      setRecipientType("individual")
                    }
                    className="h-4 w-4"
                  />

                  Specific Employee
                </label>

                {/* BATCH */}
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-amber-300">
                  <input
                    type="radio"
                    checked={recipientType === "batch"}
                    onChange={() =>
                      setRecipientType("batch")
                    }
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
                          {employeeT.lastname}, {employeeT.firstname}{" "}{employeeT.middlename ? `${employeeT.middlename.charAt(0).toUpperCase()}.` : ""}
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
                        employeeIds = allEmployee.map(
                          (employee) => employee.id
                        );
                      } else {
                        // Get IDs belonging to the selected department
                        employeeIds = allEmployee
                          .filter(
                            (employee) =>
                              employee.department === selectedDepartment
                          )
                          .map((employee) => employee.id);
                      }
                      setBatchEmployeeIds(employeeIds);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  >
                    <option value="all">
                      All Departments
                    </option>

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
                setOfficeOrderMode("view");
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
              Send Office Order
            </button>
          </div>
        </form>
      ) : (
        /* ===================================================
           ASSIGNED Office Order
        ==================================================== */
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Assigned Office Order
              </h3>

              <p className="text-sm text-slate-600">
                View office order assigned to you here.
              </p>
            </div>

            {isOfficeOrderLoading && (
              <span className="text-sm text-slate-500">
                Loading office order...
              </span>
            )}
          </div>

          {isOfficeOrderLoading ? (
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : myAssignOfficeOrder?.length > 0 ? (
            <div className="mt-6 space-y-4">
              {currentMemos.map((item) => (
                <div
                  key={item.id}
                  className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm ${
                    item.is_read
                      ? "border-slate-200 bg-white"
                      : "border-amber-300 bg-amber-50/60"
                  }`}
                >
                  {/* Unread indicator */}
                  {!item.is_read && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
                  )}

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    {/* Office Order Information */}
                    <div className="min-w-0 flex-1">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        {!item.is_read && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            New
                          </span>
                        )}

                        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                          Office Order
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="mt-2 text-lg font-bold leading-snug themed-text">
                        {item.title || "Untitled Office Order"}
                      </h4>

                      {/* Description */}
                      {item.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 themed-muted">
                          {item.description}
                        </p>
                      )}

                      {/* Office Order Details */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {/* Posted Date */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <span className="text-sm">📅</span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Posted
                            </p>

                            <p className="mt-0.5 text-sm font-medium themed-muted">
                              {FormatDate(item.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Posted By */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <span className="text-sm">👤</span>
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Posted By
                            </p>

                            <p className="mt-0.5 truncate text-sm font-medium themed-muted">
                              {item.postedBy
                                ? `${item.postedBy.firstname} ${
                                    item.postedBy.middlename
                                      ? `${item.postedBy.middlename
                                          .charAt(0)
                                          .toUpperCase()}. `
                                      : ""
                                  }${item.postedBy.lastname}`
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          handleOpenMemo(item);
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 sm:w-auto"
                      >
                        <span>View Office Order</span>
                        <span className="text-base">
                          →
                        </span>
                      </button>

                      {/* Mark as Read */}
                      {!item.is_read && (
                        <button
                          type="button"
                          disabled={markingOfficeOrderId === item.id}
                          onClick={() => handleMarkAsRead(item)}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          <span>
                            {markingOfficeOrderId === item.id ? "✓" : "✓"}
                          </span>

                          <span>
                            {markingOfficeOrderId === item.id
                              ? "Marking..."
                              : "Mark as Read"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={() =>
                  setCurrentPage((page) => page - 1)
                }
                onNext={() =>
                  setCurrentPage((page) => page + 1)
                }
              />
            </div>
          ) : (
            <EmptyState
              icon={FaRegFileAlt}
              title="No office order assigned"
              message="Office Order sent to you will appear here."
            />
          )}
        </div>
      )}
    </div>
  );
}

export default OfficeOrderTab;
