import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { supabase } from "../../../supabase";

function LeaveCreditsTab({ isAdmin, leaveCredits, employee, setEmployee }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applicationType, setApplicationType] = useState(
    leaveCredits[0]?.leave_type || ""
  );
  const [appStart, setAppStart] = useState("");
  const [appEnd, setAppEnd] = useState("");
  const [appReason, setAppReason] = useState("");
  const [daysRequested, setDaysRequested] = useState(1);
  const [recipientId, setRecipientId] = useState("");
  const [appError, setAppError] = useState("");
  const [appSuccess, setAppSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [assignedApplications, setAssignedApplications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (!employee?.id) {
      setPendingApplications([]);
      return () => {
        isMounted = false;
      };
    }

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

    // fetch applications that need approval (admins only)
    const fetchAssigned = async () => {
      try {
        if (!isAdmin) {
          setAssignedApplications([]);
          return;
        }

        const { data, error } = await supabase
          .from("leave_applications")
          .select("*")
          .eq("status", "pending")
          .eq("approved_by", employee.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch assigned leave applications:", error);
          setAssignedApplications([]);
        } else {
          setAssignedApplications(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching assigned applications:", err);
        setAssignedApplications([]);
      }
    };

    fetchAssigned();

    return () => {
      isMounted = false;
    };
  }, [employee?.id, isAdmin]);

  const resetApplicationForm = useCallback(() => {
    setApplicationType(leaveCredits[0]?.leave_type || "");
    setAppStart("");
    setAppEnd("");
    setAppReason("");
    setDaysRequested(1);
    setAppError("");
    setAppSuccess("");
  }, [leaveCredits]);

  const notifyLeaveAdmin = useCallback(async (application) => {
    const notifyBaseUrl =
      process.env.REACT_APP_NOTIFY_API_URL?.replace(/\/$/, "") ||
      "http://localhost:5000";

    try {
      const response = await fetch(`${notifyBaseUrl}/api/notify-leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: application.employee_id,
          leave_type: application.leave_type,
          start_date: application.start_date,
          end_date: application.end_date,
          days_requested: application.days_requested,
          reason: application.reason,
          approved_by: application.approved_by,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Notify endpoint returned ${response.status}: ${text}`);
      }
    } catch (notifyError) {
      console.error("Failed to notify leave admins:", notifyError);
    }
  }, []);

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
  const handleSubmitApplication = useCallback(
    async (e) => {
      e.preventDefault();
      setAppError("");
      if (!employee?.id) {
        setAppError("Unable to determine employee record. Please reload.");
        return;
      }

      const err = validateApplication();
      if (err) {
        setAppError(err);
        return;
      }

      setIsSubmitting(true);

      try {
        // if recipientId provided, attempt to resolve it as an employee number
        let targetEmployeeId = null;
        if (recipientId && recipientId.toString().trim()) {
          const empNumber = recipientId.toString().trim();
          const { data: foundEmp, error: findErr } = await supabase
            .from("employees")
            .select("id, empnumber")
            .eq("empnumber", empNumber)
            .maybeSingle();

          if (findErr) {
            console.error("Employee lookup failed:", findErr);
            setAppError("Unable to look up target employee. Please try again.");
            setIsSubmitting(false);
            return;
          }

          if (!foundEmp) {
            setAppError("Target employee not found.");
            setIsSubmitting(false);
            return;
          }

          targetEmployeeId = foundEmp.id;
        }

        const payload = {
          employee_id: employee.id,
          leave_type: applicationType,
          start_date: appStart,
          end_date: appEnd,
          days_requested: Number(daysRequested),
          reason: appReason.trim(),
          status: "pending",
          approved_by: targetEmployeeId || null,
          approved_at: null,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from("leave_applications")
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error("Failed to save leave application:", error);
          setAppError(error.message || "Failed to save application.");
          setIsSubmitting(false);
          return;
        }

        // only add to pendingApplications if the created application belongs to current employee
        if (data.employee_id === employee.id) {
          setPendingApplications((prev) => [
            data,
            ...prev.filter((p) => p.id !== data.id),
          ]);
        }

        await notifyLeaveAdmin(data);
        setAppSuccess("Application submitted and saved. Status: pending.");
        setIsApplying(false);
        resetApplicationForm();
      } catch (ex) {
        console.error(ex);
        setAppError("An unexpected error occurred while submitting.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      validateApplication,
      applicationType,
      recipientId,
      appStart,
      appEnd,
      appReason,
      daysRequested,
      resetApplicationForm,
      employee,
      notifyLeaveAdmin,
    ]
  );

  const [processingApprovalId, setProcessingApprovalId] = useState(null);

  const handleApprove = useCallback(
    async (app) => {
      if (!isAdmin) {
        console.warn("Approve attempted by non-admin");
        return;
      }
      if (!employee?.id) return;
      setProcessingApprovalId(app.id);
      try {
        // mark application approved
        const { data: updatedApp, error: updErr } = await supabase
          .from("leave_applications")
          .update({
            status: "approved",
            approved_at: new Date().toISOString(),
          })
          .eq("id", app.id)
          .select()
          .single();

        if (updErr) {
          console.error("Failed to approve application:", updErr);
          return;
        }

        // reflect the status change in local UI immediately
        if (updatedApp) {
          // remove from assigned applications (approver view)
          setAssignedApplications((prev) =>
            prev.filter((p) => p.id !== updatedApp.id)
          );

          // if the current user is the applicant, update their pending list
          if (employee && updatedApp.employee_id === employee.id) {
            setPendingApplications((prev) =>
              prev
                .map((p) => (p.id === updatedApp.id ? updatedApp : p))
                .filter((p) => p.status === "pending")
            );
          }
        }

        // deduct leave balance for the employee
        const { data: balances, error: balErr } = await supabase
          .from("employee_leave_balances")
          .select("*")
          .eq("employee_id", app.employee_id);

        if (balErr) {
          console.error("Failed to fetch leave balances:", balErr);
          alert("Failed to fetch leave balances.");
          return;
        }

        const balanceRow = balances?.find(
          (b) =>
            String(b.leave_type).trim().toLowerCase() ===
            String(app.leave_type).trim().toLowerCase()
        );

        if (!balanceRow) {
          console.error("No matching balance row found.", {
            employee_id: app.employee_id,
            app_leave_type: app.leave_type,
            balances,
          });
          alert(`No matching balance found for leave type: ${app.leave_type}`);
          return;
        }

        const currentBalance = Number(balanceRow.leave_balance || 0);
        const requestedDays = Number(app.days_requested || 0);
        const newBalance = Math.max(0, currentBalance - requestedDays);

        const { data: updatedBalance, error: updateBalanceError } =
          await supabase
            .from("employee_leave_balances")
            .update({
              leave_balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("id", balanceRow.id)
            .select("*");

        if (updateBalanceError) {
          alert("Balance update failed. Check console.");
          return;
        }

        if (!updatedBalance || updatedBalance.length === 0) {
          alert(
            "Balance update was blocked or updated 0 rows. Most likely Supabase RLS/policy issue."
          );
          return;
        }

        alert(
          `Leave balance deducted. New balance: ${updatedBalance[0].leave_balance}`
        );

        // Refresh the affected employee's leave balances in the UI
        try {
          if (typeof setEmployee === "function") {
            const { data: refreshedEmp, error: refreshErr } = await supabase
              .from("employees")
              .select(
                `
                id,
                empnumber,
                firstname,
                middlename,
                lastname,
                department,
                position,
                empstatus,
                address,
                phone1,
                phone2,
                birthdate,
                tin,
                sss,
                pagibig,
                philhealth,
                datehired,
                basicrate,
                riceallowance,
                role,
                user_id,
                employee_leave_balances (
                  leave_type,
                  leave_balance
                )
              `
              )
              .eq("id", app.employee_id)
              .maybeSingle();

            if (!refreshErr && refreshedEmp) {
              setEmployee((prev) =>
                prev && prev.id === refreshedEmp.id ? refreshedEmp : prev
              );
            }
          }
        } catch (refreshErr) {
          console.error(
            "Failed to refresh employee after balance update:",
            refreshErr
          );
        }

        // remove from assigned list
        setAssignedApplications((prev) => prev.filter((p) => p.id !== app.id));
      } catch (err) {
        console.error(err);
      } finally {
        setProcessingApprovalId(null);
      }
    },
    [employee, isAdmin, setEmployee]
  );

  const handleReject = useCallback(
    async (app) => {
      if (!isAdmin) {
        console.warn("Reject attempted by non-admin");
        return;
      }
      if (!employee?.id) return;
      setProcessingApprovalId(app.id);
      try {
        await supabase
          .from("leave_applications")
          .update({ status: "rejected", approved_at: new Date().toISOString() })
          .eq("id", app.id);

        // reflect the rejection in local UI
        setAssignedApplications((prev) => prev.filter((p) => p.id !== app.id));
        if (employee && app.employee_id === employee.id) {
          setPendingApplications((prev) => prev.filter((p) => p.id !== app.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProcessingApprovalId(null);
      }
    },
    [employee, isAdmin]
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
            Apply for leave
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
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={daysRequested}
                    onChange={(e) => setDaysRequested(e.target.value)}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
                    style={{ border: "1px solid var(--muted)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold themed-muted">
                    Recipient Employee ID (manual, optional)
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="e.g. 12345"
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
                  {isSubmitting ? "Submitting..." : "Submit application"}
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
            Applications Assigned To You
          </h3>
          <div className="mt-4 space-y-3">
            {assignedApplications.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {a.leave_type} — Employee: {a.employee_id}
                    </p>
                    <p className="font-semibold">
                      {a.start_date} → {a.end_date} ({a.days_requested} days)
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{a.reason}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(a)}
                      disabled={processingApprovalId === a.id}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {processingApprovalId === a.id
                        ? "Processing..."
                        : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(a)}
                      disabled={processingApprovalId === a.id}
                      className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                    >
                      {processingApprovalId === a.id
                        ? "Processing..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingApplications.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Pending Applications
          </h3>
          <div className="mt-4 space-y-3">
            {pendingApplications.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{a.leave_type}</p>
                    <p className="font-semibold">
                      {a.start_date} → {a.end_date}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">{a.reason}</p>
                  </div>
                  <div className="text-sm font-medium text-amber-700">
                    {a.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveCreditsTab;
