import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../../../supabase";
import RejectApplicationReasonModal from "../../RejectApplicationReasonModal";
import Pagination from "../../Pagination";

function LeaveCreditsTab({ isAdmin, leaveCredits, employee, setEmployee }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applicationType, setApplicationType] = useState("");
  const [appStart, setAppStart] = useState("");
  const [appEnd, setAppEnd] = useState("");
  const [appReason, setAppReason] = useState("");
  const [daysRequested, setDaysRequested] = useState(0);
  const [appError, setAppError] = useState("");
  const [appSuccess, setAppSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [assignedApplications, setAssignedApplications] = useState([]);
  const [historyApplications, setHistoryApplications] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [approverId, setApproverId] = useState(null);
  const [approverName, setApproverName] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [approverEmail, setApproverEmail] = useState(null);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [processingApproval, setIsProcessingApproval] = useState(null);
  const [processingReject, setIsProcessingReject] = useState(null);
  const [processingCancel, setIsProcessingCancel] = useState(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const ITEMS_PER_PAGE = 5;

  // Page state for each list
  const [assignedPage, setAssignedPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  // ====================
  // Assigned Applications
  // ====================
  const assignedTotalPages = Math.ceil(
    assignedApplications.length / ITEMS_PER_PAGE
  );

  const paginatedAssignedApplications = assignedApplications.slice(
    (assignedPage - 1) * ITEMS_PER_PAGE,
    assignedPage * ITEMS_PER_PAGE
  );

  // ====================
  // Pending Applications
  // ====================
  const pendingTotalPages = Math.ceil(
    pendingApplications.length / ITEMS_PER_PAGE
  );

  const paginatedPendingApplications = pendingApplications.slice(
    (pendingPage - 1) * ITEMS_PER_PAGE,
    pendingPage * ITEMS_PER_PAGE
  );

  // ====================
  // History Applications
  // ====================
  const filteredHistoryApplications = historyStatusFilter === "all"
                                    ? historyApplications
                                    : historyApplications.filter(
                                    (app) => app.status === historyStatusFilter
                                    );

  const historyTotalPages = Math.ceil(
    filteredHistoryApplications.length / ITEMS_PER_PAGE
  );

  const paginatedHistoryApplications = filteredHistoryApplications.slice(
    (historyPage - 1) * ITEMS_PER_PAGE,
    historyPage * ITEMS_PER_PAGE
  );

  const openRejectModal = (application) => {
    setSelectedApplication(application);
    setRejectModalOpen(true);
  };

  const getApproverEmployeeIdByDepartment = async () => {
    try {
      // Get the approver ID
      const { data: approverData } = await supabase
        .from("can_approve_leave")
        .select("emp_id, dept, email")
        .eq("dept", employee.department)
        .single()
        .throwOnError();
        setApproverId(approverData.emp_id);
        setApproverEmail(approverData.email || null);

      // Fetch the approver's name and email from employees
      const { data: approver } = await supabase
        .from("employees")
        .select("firstname, middlename, lastname")
        .eq("id", approverData.emp_id)
        .single()
        .throwOnError();

      const approverName = `${approver.firstname} ${
        approver.middlename ? `${approver.middlename.charAt(0).toUpperCase()}. ` : ""
      }${approver.lastname} - ${approverData.dept}`;
      setApproverName(approverName);
    } catch (error) {
      console.error("Failed to fetch approver:", error);
      setApproverId(null);
      setApproverName(null);
      setApproverEmail(null);
    }
  };
  useEffect(() => {
    if (employee?.department) {
      getApproverEmployeeIdByDepartment();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.department]);

  useEffect(() => {
    // Assigned Applications
    const assignedPages = Math.max(
      1,
      Math.ceil(assignedApplications.length / ITEMS_PER_PAGE)
    );

    if (assignedPage > assignedPages) {
      setAssignedPage(assignedPages);
    }

    // Pending Applications
    const pendingPages = Math.max(
      1,
      Math.ceil(pendingApplications.length / ITEMS_PER_PAGE)
    );

    if (pendingPage > pendingPages) {
      setPendingPage(pendingPages);
    }

    // History Applications (Filtered)
    const historyPages = Math.max(
      1,
      Math.ceil(filteredHistoryApplications.length / ITEMS_PER_PAGE)
    );

    if (historyPage > historyPages) {
      setHistoryPage(historyPages);
    }
  }, [
    assignedApplications.length,
    pendingApplications.length,
    filteredHistoryApplications.length,
    assignedPage,
    pendingPage,
    historyPage,
  ]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyStatusFilter]);

  useEffect(() => {
  if (!appStart || !appEnd) {
    setDaysRequested("");
    return;
  }

  const start = new Date(appStart);
  const end = new Date(appEnd);

  if (end < start) {
    setDaysRequested("");
    return;
  }

  let workingDays = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();

    // Monday-Friday
    if (day >= 1 && day <= 5) {
      workingDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  setDaysRequested(isHalfDay ? workingDays - 0.5 : workingDays);
}, [appStart, appEnd, isHalfDay]);

  useEffect(() => {
    let isMounted = true;

    if (!employee?.id) {
      setPendingApplications([]);
      return () => {
        isMounted = false;
      };
    }
    const fetchHistoryApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("leave_applications")
          .select("*")
          .eq("employee_id", employee.id)
          .in("status", ["approved", "rejected", "cancelled"])
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error("Failed to fetch history leave applications:", error);
          setHistoryApplications([]);
        } else {
          setHistoryApplications(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching history applications:", err);
        if (isMounted) setHistoryApplications([]);
      }
    };
    fetchHistoryApplications();
    const fetchPendingApplications = async () => {
      try {
        const { data, error } = await supabase
          .from("leave_applications")
          .select("*")
          .eq("employee_id", employee.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error("Failed to fetch pending leave applications:", error);
          setPendingApplications([]);
        } else {
          setPendingApplications(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching pending applications:", err);
        if (isMounted) setPendingApplications([]);
      }
    };
    fetchPendingApplications();
    const fetchAssigned = async () => {
      try {
        if (!isAdmin) {
          setAssignedApplications([]);
          return;
        }

        // Fetch leave applications
        const { data: applications } = await supabase
          .from("leave_applications")
          .select("*")
          .eq("status", "pending")
          .eq("approved_by", employee.id)
          .order("created_at", { ascending: false })
          .throwOnError();

        if (!applications?.length) {
          setAssignedApplications([]);
          return;
        }

        // Get unique employee IDs
        const employeeIds = [
          ...new Set(applications.map((app) => app.employee_id)),
        ];

        // Fetch employees
        const { data: employees } = await supabase
          .from("employees")
          .select("id, firstname, middlename, lastname")
          .in("id", employeeIds)
          .throwOnError();

        // Create a lookup map
        const employeeMap = Object.fromEntries(
          employees.map((emp) => [emp.id, emp])
        );

        // Merge employee into each application
        const mergedData = applications.map((app) => ({
          ...app,
          employee: employeeMap[app.employee_id] || null,
        }));
        setAssignedApplications(mergedData);
      } catch (error) {
        console.error("Failed to fetch assigned leave applications:", error);
        setAssignedApplications([]);
      }
    };
    fetchAssigned();
    return () => {
      isMounted = false;
    };
  }, [employee?.id, isAdmin]);

  const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  const resetApplicationForm = useCallback(() => {
    setApplicationType(leaveCredits[0]?.leave_type || "");
    setAppStart("");
    setAppEnd("");
    setAppReason("");
    setDaysRequested(1);
    setAppError("");
    setAppSuccess("");
  }, [leaveCredits]);

  const validateApplication = useCallback(() => {
    setAppError("");
    if (!applicationType) return "Please choose a leave type.";
    if (!appStart) return "Please choose a start date.";
    if (!appEnd) return "Please choose an end date.";
    if (new Date(appStart) > new Date(appEnd))
      return "Start date cannot be after end date.";
    if (!appReason.trim()) return "Please provide a reason for your leave.";
    const dr = Number(daysRequested);
    if (!Number.isFinite(dr) || dr <= 0)
      return "Please enter a valid number of days.";
    return "";
  }, [applicationType, appStart, appEnd, appReason, daysRequested]);

// const handleSubmitApplication = useCallback(
//   async (e) => {
//     e.preventDefault();

//     const availableBalance = leaveCredits.find(
//       (l) =>
//         String(l.leave_type).trim().toLowerCase() ===
//         String(applicationType).trim().toLowerCase()
//     )?.leave_balance;

//     if (
//       availableBalance !== undefined &&
//       Number(daysRequested) > Number(availableBalance)
//     ) {
//       setAppError(
//         `Insufficient leave balance. You have ${availableBalance} days available for ${applicationType}.`
//       );
//       return;
//     }

//     setAppError("");

//     if (!employee?.id) {
//       setAppError("Unable to determine employee record. Please reload.");
//       return;
//     }

//     const err = validateApplication();

//     if (err) {
//       setAppError(err);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const payload = {
//         employee_id: employee.id,
//         leave_type: applicationType,
//         start_date: appStart,
//         end_date: appEnd,
//         days_requested: Number(daysRequested),
//         reason: appReason.trim(),
//         status: "pending",
//         approved_by: approverId || null,
//         approved_at: null,
//         created_at: new Date().toISOString(),
//       };

//       // console.log("Submitting leave application...");
//       // console.log(payload);

//       const { data, error } = await supabase
//         .from("leave_applications")
//         .insert(payload)
//         .select();

//       if (error) {
//         console.error("❌ Failed to save leave application:", error);
//         setAppError(error.message || "Failed to save application.");
//         return;
//       }

//       console.log("Leave filing application response:", data.length);

//       // Update pending applications list
//       if (data[0].employee_id === employee.id) {
//         setPendingApplications((prev) => [
//           data[0],
//           ...prev.filter((p) => p.id !== data[0].id),
//         ]);
//       }
//       setAppSuccess("Application submitted and saved. Status: pending.");
//       setIsApplying(false);
//       resetApplicationForm();
//     } catch (ex) {
//       console.error("Unexpected error:", ex);
//       setAppError("An unexpected error occurred while submitting.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   },
//   [
//     leaveCredits,
//     daysRequested,
//     employee,
//     applicationType,
//     appStart,
//     appEnd,
//     appReason,
//     approverId,
//     validateApplication,
//     resetApplicationForm
//   ]
// );

const handleSubmitApplication = useCallback(
  async (e) => {
    e.preventDefault();

    const availableBalance = leaveCredits.find(
      (l) =>
        String(l.leave_type).trim().toLowerCase() ===
        String(applicationType).trim().toLowerCase()
    )?.leave_balance;

    if (
      availableBalance !== undefined &&
      Number(daysRequested) > Number(availableBalance)
    ) {
      setAppError(
        `Insufficient leave balance. You have ${availableBalance} days available for ${applicationType}.`
      );
      return;
    }

    setAppError("");

    if (!employee?.id) {
      setAppError(
        "Unable to determine employee record. Please reload."
      );
      return;
    }

    const err = validateApplication();

    if (err) {
      setAppError(err);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        employee_id: employee.id,
        leave_type: applicationType,
        start_date: appStart,
        end_date: appEnd,
        days_requested: Number(daysRequested),
        reason: appReason.trim(),
        status: "pending",

        // Keep this NULL when the application is first filed.
        // approved_by should identify who actually approved it.
        approved_by: null,
        approved_at: null,

        created_at: new Date().toISOString(),
      };

      // -----------------------------------------
      // 1. Save leave application
      // -----------------------------------------
      const { data, error } = await supabase
        .from("leave_applications")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error(
          "❌ Failed to save leave application:",
          error
        );

        setAppError(
          error.message || "Failed to save application."
        );

        return;
      }

      console.log(
        "✅ Leave application saved:",
        data
      );

      // -----------------------------------------
      // 2. Send email notification to approver
      // -----------------------------------------
      const { data: emailData, error: emailError } =
      await supabase.functions.invoke(
        "send-leave-email",
        {
          body: {
            applicationId: data.id,
            origin: window.location.origin,
          },
        }
      );

      if (emailError) {
        console.error(
          "⚠️ Leave application was saved, but email notification failed:",
          emailError
        );

        setAppSuccess(
          "Application submitted and saved, but the approver email notification could not be sent."
        );
      } else {
        console.log(
          "✅ Approver email sent:",
          emailData
        );

        setAppSuccess(
          "Application submitted successfully. The approver has been notified by email."
        );
      }

      // -----------------------------------------
      // 3. Update pending applications list
      // -----------------------------------------
      if (data.employee_id === employee.id) {
        setPendingApplications((prev) => [
          data,
          ...prev.filter(
            (p) => p.id !== data.id
          ),
        ]);
      }

      // -----------------------------------------
      // 4. Close/reset form
      // -----------------------------------------
      setIsApplying(false);
      resetApplicationForm();

    } catch (ex) {
      console.error(
        "Unexpected error:",
        ex
      );

      setAppError(
        "An unexpected error occurred while submitting."
      );
    } finally {
      setIsSubmitting(false);
    }
  },
  [
    leaveCredits,
    daysRequested,
    employee,
    applicationType,
    appStart,
    appEnd,
    appReason,
    validateApplication,
    resetApplicationForm,
  ]
);

  const handleApprove = useCallback(
    async (app) => {
      const confirmed = window.confirm(
        "Are you sure you want to approve this leave application?"
      );
      if (!confirmed) return;
      if (!isAdmin) {
        console.warn("Approve attempted by non-admin");
        return;
      }

      if (!employee?.id) return;
      setIsProcessingApproval(app.id);
      try {
        // Retrieve leave balances
        const { data: balances } = await supabase
          .from("employee_leave_balances")
          .select("*")
          .eq("employee_id", app.employee_id)
          .throwOnError();

        // Find matching leave type
        const balanceRow = balances?.find(
          (b) =>
            String(b.leave_type).trim().toLowerCase() ===
            String(app.leave_type).trim().toLowerCase()
        );

        if (!balanceRow) {
          throw new Error(
            `No matching balance found for leave type: ${app.leave_type}`
          );
        }

        // Compute new balance
        const currentBalance = Number(balanceRow.leave_balance || 0);
        const requestedDays = Number(app.days_requested || 0);
        const newBalance = Math.max(0, currentBalance - requestedDays);

        // Update leave balance
        const { data: updatedBalance } = await supabase
          .from("employee_leave_balances")
          .update({
            leave_balance: newBalance,
            updated_at: new Date().toISOString(),
          })
          .eq("id", balanceRow.id)
          .select("*")
          .throwOnError();
          console.log("Update balance response:", updatedBalance.length);
        if (!updatedBalance?.length) {
          throw new Error(
            "Balance update was blocked or updated 0 rows."
          );
        }

        // Approve application
        const { data: updatedApp } = await supabase
          .from("leave_applications")
          .update({
            status: "approved",
            approved_at: new Date().toISOString(),
          })
          .eq("id", app.id)
          .select("*")
          .throwOnError();
          console.log("Approve application response:", updatedApp.length);
        // Update UI
        setAssignedApplications((prev) =>
          prev.filter((p) => p.id !== updatedApp[0].id)
        );
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== updatedApp[0].id)
        );

        alert("Application Approved Successfully.");
      } catch (error) {
        console.error("Approval failed:", error);
        alert(error.message || "Failed to approve leave application.");
      } finally {
        setIsProcessingApproval(null);
      }
    },
    [employee, isAdmin]
  );

const handleCancelApplication = async (appid) => {
  const confirmed = window.confirm(
    "Are you sure you want to cancel this leave application?"
  );

  if (!confirmed) return;
  setIsProcessingCancel(appid);
  try {
    const { data, error } = await supabase
      .from("leave_applications")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", appid)
      .select()
      .throwOnError();

    console.log("Cancel application response:", data.length);
    if (error) {
      console.error("Failed to cancel application:", error);
      alert("Failed to Cancel Application.");
      return;
    }
    if (!data || data.length === 0) {
      alert("Failed to Cancel Application. The application may not exist or you don't have permission.");
      return;
    }
    setPendingApplications((prev) =>
      prev.filter((p) => p.id !== appid)
    );
    setAssignedApplications((prev) =>
      prev.filter((p) => p.id !== appid)
    );
    alert("Leave Application Cancelled Successfully.");
  } catch (error) {
    console.error("Failed to cancel application:", error);
    alert("Failed to Cancel Application.");
  } finally {
    setIsProcessingCancel(null);
  }
};

const handleReject = useCallback(
  async (reason) => {
    if (!selectedApplication) return;

    if (!isAdmin) {
      console.warn("Only admins can reject leave applications.");
      return;
    }

    if (!employee?.id) {
      console.warn("No logged-in employee.");
      return;
    }

    setIsProcessingReject(selectedApplication.id);

    try {
      const { data } = await supabase
        .from("leave_applications")
        .update({
          status: "rejected",
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
        })
        .eq("id", selectedApplication.id)
        .select()
        .throwOnError();

      console.log("Reject application response:", data.length);

      // Remove from the admin's assigned applications
      setAssignedApplications((prev) =>
        prev.filter((p) => p.id !== data[0].id)
      );

      // Remove from the employee's pending list if applicable
      if (data[0].employee_id === employee.id) {
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== data.id)
        );
      }

      setRejectModalOpen(false);
      setSelectedApplication(null);

      alert("Leave Application Rejected Successfully.");
    } catch (error) {
      console.error("Failed to reject application:", error);
      alert(error.message || "Failed to Reject Leave Application.");
    } finally {
      setIsProcessingReject(null);
    }
  },
  [employee, isAdmin, selectedApplication]
);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm font-medium text-slate-500">Leave Balances</p>
          <p className="text-lg font-bold text-slate-900">
            Apply for leave and review balances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsApplying(true);
              setAppError("");
              setAppSuccess("");
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Notifications moved inside the modal when applying */}

      {isApplying && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.5)", padding: "1.5rem" }}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl themed-bg-card"
            style={{ border: "1px solid var(--muted)" }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 themed-bg-section themed-border"
              style={{ position: "relative" }}
            >
              <div>
                <h3 className="text-lg font-semibold themed-text">
                  Apply for Leave
                </h3>
                <p className="text-sm themed-muted">
                  Submit your leave application. Status will be set to pending.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsApplying(false);
                  resetApplicationForm();
                }}
                aria-label="Close"
                className="p-1 text-slate-600 hover:text-slate-900"
                style={{ background: "transparent", border: "none" }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            {appError && (
              <div
                className="rounded-md px-4 py-3 text-sm m-6"
                style={{
                  border: "1px solid var(--muted)",
                  background: "#fff6f6",
                  color: "#7f1d1d",
                }}
                role="alert"
              >
                {appError}
              </div>
            )}

            {appSuccess && (
              <div
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 m-6"
                role="status"
              >
                {appSuccess}
              </div>
            )}

            <form
              onSubmit={handleSubmitApplication}
              className="space-y-4 p-6 themed-bg-card themed-text"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold themed-muted">
                    Leave Type
                  </label>

                  <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: "1px solid var(--muted)" }}
                  >
                    <option value="" disabled>
                      -- Please Select a Leave Type --
                    </option>

                    {leaveCredits.map((l) => (
                      <option key={l.leave_type} value={l.leave_type}>
                        {l.leave_type} ({l.leave_balance ?? 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold themed-muted">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={appStart}
                    onChange={(e) => setAppStart(e.target.value)}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: "1px solid var(--muted)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold themed-muted">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={appEnd}
                    onChange={(e) => setAppEnd(e.target.value)}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: "1px solid var(--muted)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold themed-muted">
                    Days Requested
                  </label>

                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      value={daysRequested}
                      readOnly
                      className="flex-1 rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                      style={{ border: "1px solid var(--muted)" }}
                    />

                    <button
                      type="button"
                      onClick={() => setIsHalfDay((prev) => !prev)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                        isHalfDay
                          ? "bg-amber-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {isHalfDay ? "Half Day ✓" : "Half Day"}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold themed-muted">
                    Approver Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${approverName}`}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: "1px solid var(--muted)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold themed-muted">
                    Reason
                  </label>
                  <textarea
                    value={appReason}
                    onChange={(e) => setAppReason(e.target.value)}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    rows={3}
                    style={{ border: "1px solid var(--muted)" }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsApplying(false);
                    resetApplicationForm();
                  }}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition hover:bg-slate-100"
                  style={{
                    border: "1px solid var(--muted)",
                    background: "var(--card-bg)",
                    color: "var(--text-primary)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {leaveCredits.map((ledger, index) => (
          <div
            key={`${ledger.leave_type}-${index}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">Leave Type</p>
              <p className="truncate text-lg font-bold text-slate-900">
                {ledger.leave_type || "Leave"}
              </p>
            </div>
            <div className="flex h-16 w-16 flex-none flex-col items-center justify-center rounded-lg bg-amber-50 text-center">
              <span className="text-xl font-bold text-slate-900">
                {ledger.leave_balance ?? 0}
              </span>
              <span className="text-xs font-medium text-amber-700">
                Balance
              </span>
            </div>
          </div>
        ))}
      </div>

      {assignedApplications.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Leave Applications - ({assignedApplications.length})
          </h3>
          <div className="mt-4 space-y-3">
            {paginatedAssignedApplications.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {a.leave_type} — {a.employee.lastname}, {a.employee.firstname} {a.employee.middlename ? a.employee.middlename.charAt(0).toUpperCase() + "." : ""}
                    </p>
                    <p className="font-semibold">
                      {formatDate(a.start_date)} → {formatDate(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
                    </p>
                    <p className="mt-1 text-sm italic text-slate-600">
                      Leave Reason: {a.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(a)}
                      disabled={processingApproval === a.id}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {processingApproval === a.id
                        ? "Processing..."
                        : "Approve"}
                    </button>
                    <RejectApplicationReasonModal
                      isOpen={rejectModalOpen}
                      loading={processingReject !== null}
                      onClose={() => {
                        setRejectModalOpen(false);
                        setSelectedApplication(null);
                      }}
                      onConfirm={handleReject}
                    />
                    <button
                      type="button"
                      onClick={() => openRejectModal(a)}
                      disabled={processingReject === a.id}
                      className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      {processingReject === a.id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={assignedPage}
            totalPages={assignedTotalPages}
            onPrevious={() =>
              setAssignedPage((page) => Math.max(page - 1, 1))
            }
            onNext={() =>
              setAssignedPage((page) => Math.min(page + 1, assignedTotalPages))
            }
          />
        </div>
      )}

      {pendingApplications.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Pending Leave Applications ({pendingApplications.length})
          </h3>

          <div className="mt-4 space-y-3">
            {paginatedPendingApplications.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{a.leave_type}</p>

                    <p className="font-semibold">
                      {formatDate(a.start_date)} → {formatDate(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
                    </p>

                    <p className="mt-1 text-sm italic text-slate-600">
                      Leave Reason: {a.reason}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={processingCancel === a.id}
                    onClick={() => handleCancelApplication(a.id)}
                    className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    {processingCancel === a.id
                        ? "Processing..."
                        : "Cancel"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={pendingPage}
            totalPages={pendingTotalPages}
            onPrevious={() =>
              setPendingPage((page) => Math.max(page - 1, 1))
            }
            onNext={() =>
              setPendingPage((page) => Math.min(page + 1, pendingTotalPages))
            }
          />
        </div>
      )}
      {historyApplications.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Leave Application History ({filteredHistoryApplications.length})
            </h3>

            <select
              value={historyStatusFilter}
              onChange={(e) => setHistoryStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mt-4 space-y-3">
            <div className="mt-4 space-y-3">
              {filteredHistoryApplications.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    No applications found.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    There are no {historyStatusFilter === "all" ? "" : historyStatusFilter} leave applications to display.
                  </p>
                </div>
              ) : (
                paginatedHistoryApplications.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left Side */}
                      <div>
                        <p className="text-sm text-slate-500">{a.leave_type}</p>

                        <p className="font-semibold">
                          {formatDate(a.start_date)} → {formatDate(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
                        </p>

                        <p className="mt-1 text-sm italic text-slate-600">
                          Leave Reason: {a.reason}<br></br>
                          {a.status === "rejected" ?  `Rejection Reason: ${a.rejection_reason}` : ""}
                        </p>
                      </div>

                      {/* Right Side - Status */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          a.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : a.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : a.status === "cancelled"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Pagination
              currentPage={historyPage}
              totalPages={historyTotalPages}
              onPrevious={() =>
                setHistoryPage((page) => Math.max(page - 1, 1))
              }
              onNext={() =>
                setHistoryPage((page) =>
                  Math.min(page + 1, historyTotalPages)
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveCreditsTab;
