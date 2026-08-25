import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
import { supabase } from "../../../supabase";
import RejectApplicationReasonModal from "../../RejectApplicationReasonModal";
import Pagination from "../../Pagination";
import {
  getLeaveApproverByDepartment,
  getMyHistoryApplicationByID,
  getMyPendingApplicationByID,
  getAllPendingApplications
} from "../../../services/getservices";
import {
  createLeaveApplication
} from "../../../services/postservices";
import {
  cancelApplication,
  rejectApplication,
  approveApplication
} from "../../../services/updateservices";
import {
  formatName_FN_MI_LN,
  formatDate_Month_Day_Year
} from "../../../utils";

function LeaveCreditsTab({ leaveCredits, employee }) {
  const myID = employee.id;
  const myDepartment = employee.department;
  const myName = formatName_FN_MI_LN(employee.firstname, employee.middlename, employee.lastname);
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
  const [approverId, setApproverId] = useState([]);
  const [approverName, setApproverName] = useState([]);
  const [approverEmail, setApproverEmail] = useState([]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [processingApproval, setIsProcessingApproval] = useState(null);
  const [processingReject, setIsProcessingReject] = useState(null);
  const [processingCancel, setIsProcessingCancel] = useState(null);
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [retrieveApproverLoading, setRetrieveApproverLoading] = useState(false);
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

  useEffect(() => {
    const fetchLeaveApprover = async () => {
      try {
        setRetrieveApproverLoading(true);
        const leaveApprover = await getLeaveApproverByDepartment(myDepartment);
        const { approverEmails, approverIDs, approverNames } = leaveApprover;
        setApproverId(approverIDs);
        setApproverName(approverNames);
        setApproverEmail(approverEmails);      
      } catch (error) {
        setApproverId([]);
        setApproverName([]);
        setApproverEmail([]); 
        console.error(
          "Error fetching leave approver:",
          error
        );
      } finally {
        setRetrieveApproverLoading(false);
      }
    };
    fetchLeaveApprover();
  }, [myDepartment]);

  useEffect(() => {
    // Assigned Applications
    const assignedPages = Math.max(1, Math.ceil(assignedApplications.length / ITEMS_PER_PAGE));
    if (assignedPage > assignedPages) {setAssignedPage(assignedPages);}

    // Pending Applications
    const pendingPages = Math.max(1, Math.ceil(pendingApplications.length / ITEMS_PER_PAGE));
    if (pendingPage > pendingPages) {setPendingPage(pendingPages);}

    // History Applications (Filtered)
    const historyPages = Math.max(1, Math.ceil(filteredHistoryApplications.length / ITEMS_PER_PAGE));
    if (historyPage > historyPages) {setHistoryPage(historyPages);}
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
    const day = current.getDay()
    // Monday-Friday
    if (day >= 1 && day <= 5) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  setDaysRequested(isHalfDay ? workingDays - 0.5 : workingDays);
}, [appStart, appEnd, isHalfDay]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!myID) {
          throw new Error("Employee ID is required.");
        }
        // Fetch History Applications
        try {
          const responseHistory = await getMyHistoryApplicationByID(myID);
          setHistoryApplications(responseHistory || []);
        } catch (error) {
          console.error("Error fetching history applications:", error);
          setHistoryApplications([]);
        }

        // Fetch Pending Applications
        try {
          const responsePending = await getMyPendingApplicationByID(myID);
          setPendingApplications(responsePending || []);
        } catch (error) {
          console.error("Error fetching pending applications:", error);
          setPendingApplications([]);
        }

        // Fetch Assign Applications
        try {
          const responseAssign = await getAllPendingApplications();
          const myAssignApplications = responseAssign.filter((application) =>
            application.approver_id_status?.some(
              (approver) =>
                Number(approver.id) === Number(myID) &&
                approver.status === "pending"
            )
          );
          setAssignedApplications(myAssignApplications || []);
        } catch (error) {
          console.error("Error fetching assign applications:", error);
          setAssignedApplications([]);
        }
      } catch (error) {
        console.error(
          "Error fetching applications:",
          error
        );
      }
    };
    fetch();
  }, [myID]);

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
    if (!myID) {
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
    const IDs_Status = approverId.map((id) => ({
      id: id,
      status: "pending"
    }));
    const payload = {
      employee_id: myID,
      leave_type: applicationType,
      start_date: appStart,
      end_date: appEnd,
      days_requested: Number(daysRequested),
      reason: appReason.trim(),
      status: "pending",
      approver_id_status: IDs_Status,
      approved_at: null,
      created_at: new Date().toISOString(),
      cancelled_at: null
    };

    try {
      setIsSubmitting(true);
      const response = await createLeaveApplication(payload);
      const { data: emailData, error: emailError } = await supabase.functions.invoke("send-leave-email", {
        body: {
          myDepartment: myDepartment,
          application: response.data,
          origin: window.location.origin,
          approverEmail: approverEmail,
          myName: myName
        },
      });

      if (emailError) {
        console.error(
          "Email notification failed:",
          emailError
        );

        setAppSuccess(
          "Approver email notification could not be sent."
        );
      } else {
        setAppSuccess(
          "Application submitted successfully. The approver has been notified by email."
        );
      }

      if (response.success && !emailError && emailData?.success === true) {
        alert(response.message);
      } else if (response.success && emailError) {
        console.error("Email Error:", emailError);
        alert(
          "Leave application was created, but the email could not be sent."
        );
      } else {
        alert("Failed to submit leave application.");
      }

      setIsApplying(false);
      resetApplicationForm();

    } catch (error) {
      console.error("Error:",error);
      setAppError(
        "An unexpected error occurred while submitting."
      );
    } finally {
      setIsSubmitting(false);
    }
  },
  [leaveCredits, daysRequested, myID, validateApplication, approverId, applicationType, appStart, appEnd, appReason, myDepartment, approverEmail, myName, resetApplicationForm]
);

  const handleApprove = async (application) => {
    if (!application) {
      alert("No Application Selected.");
    };
    const confirmed = window.confirm(
      "Are you sure you want to approve this leave application?"
    );
    if (!confirmed) return;

    try {
      setIsProcessingApproval(application.id);
      const response = await approveApplication(application, myID);
      if (response.success) {
        alert(response.message);
        setAssignedApplications((prev) =>
          prev.filter((p) => p.id !== application.id)
        );
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== application.id)
        );
      } else {
        console.log(response);
      }
      
    } catch (error) {
      console.error("Failed to approve application:", error);
    } finally {
      setIsProcessingApproval(null);
    }
  }

  const handleCancelApplication = async (application_id) => {
    if (!application_id) {
      console.error("No Application ID Provided.");
      alert("No Application ID Provided.");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to cancel this leave application?"
    );
    if (!confirmed) return;
    try {
      setIsProcessingCancel(application_id);
      const response = await cancelApplication(application_id);
      setPendingApplications((prev) =>
        prev.filter((p) => p.id !== application_id)
      );
      setAssignedApplications((prev) =>
        prev.filter((p) => p.id !== application_id)
      );
      if (response.success) {
        alert(response.message);
      } else {
        console.log(response.response);
      }
    } catch (error) {
      console.error("Failed to cancel application:", error);
    } finally {
      setIsProcessingCancel(null);
    }
  }

  const handleReject = async (reason) => {
    if (!reason) {
      console.error("No Reason Provided.");
      alert("No Reason Provided.");
      return;
    }
    if (!selectedApplication) {
      console.error("No Application Provided.");
      alert("No Application Provided.");
      return;
    } 
    const confirmed = window.confirm(
      "Are you sure you want to reject this leave application?"
    );
    if (!confirmed) return;
    try {
      setIsProcessingReject(selectedApplication.id);
      const response = await rejectApplication(selectedApplication, reason, myID);
      setAssignedApplications((prev) =>
        prev.filter((p) => p.id !== response.response.id)
      );
      if (response.response.employee_id === myID) {
        setPendingApplications((prev) =>
          prev.filter((p) => p.id !== response.response.id)
        );
      }
      setRejectModalOpen(false);
      setSelectedApplication(null);
      if (response.success) {
        alert(response.message);
      } else {
        console.log(response.response);
      }
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setIsProcessingReject(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
        {/* Subtle accent */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600" />

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          {/* Header */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Icon */}
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
              <FaCalendarAlt className="h-5 w-5" />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Leave Management
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Leave Balances
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Apply for leave and review your available balances.
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            type="button"
            onClick={() => {
              setIsApplying(true);
              setAppError("");
              setAppSuccess("");
            }}
            className="
              group
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-amber-600
              px-5
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              shadow-amber-200
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-amber-700
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-amber-400
              focus:ring-offset-2
              sm:w-auto
            "
          >
            <span>Apply for Leave</span>

            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>

      {/* Notifications moved inside the modal when applying */}

{isApplying &&
  !retrieveApproverLoading &&
  createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">

      {/* =====================================================
          FULL SCREEN BACKDROP
      ====================================================== */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={() => {
          if (isSubmitting) return;

          setIsApplying(false);
          resetApplicationForm();
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          MODAL
      ====================================================== */}
      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-3xl
          max-h-[calc(100vh-2rem)]
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-200/70
          bg-white
          shadow-[0_25px_80px_rgba(15,23,42,0.25)]
          sm:max-h-[calc(100vh-3rem)]
        "
      >

        {/* =================================================
            MODAL HEADER
        ================================================== */}
        <div className="relative flex flex-none items-center justify-between gap-4 border-b border-slate-200/70 bg-gradient-to-r from-amber-50/80 via-white to-white px-6 py-5 sm:px-7">

          {/* Accent */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600" />

          <div className="flex min-w-0 items-center gap-4">

            {/* Icon */}
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
              <FaCalendarAlt className="h-5 w-5" />
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Apply for Leave
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Submit your leave application for approval.
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => {
              if (isSubmitting) return;

              setIsApplying(false);
              resetApplicationForm();
            }}
            disabled={isSubmitting}
            aria-label="Close"
            className="
              flex
              h-10
              w-10
              flex-none
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-500
              shadow-sm
              transition-all
              duration-200
              hover:border-red-200
              hover:bg-red-50
              hover:text-red-600
              focus:outline-none
              focus:ring-2
              focus:ring-amber-400
              focus:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <FaTimes className="h-4 w-4" />
          </button>

        </div>


        {/* =================================================
            SCROLLABLE CONTENT
        ================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* Error */}
          {appError && (
            <div className="mx-6 mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-7">
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>

                <p>{appError}</p>

              </div>
            </div>
          )}

          {/* Success */}
          {appSuccess && (
            <div className="mx-6 mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-7">
              <div className="flex items-start gap-3">

                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  ✓
                </div>

                <p>{appSuccess}</p>

              </div>
            </div>
          )}


          {/* =================================================
              FORM
          ================================================== */}
          <form
            onSubmit={handleSubmitApplication}
            className="space-y-5 p-6 sm:p-7"
          >

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Leave Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Leave Type
                </label>

                <select
                  value={applicationType}
                  onChange={(e) =>
                    setApplicationType(e.target.value)
                  }
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-amber-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-amber-100
                  "
                >
                  <option value="" disabled>
                    -- Please Select a Leave Type --
                  </option>

                  {leaveCredits.map((l) => (
                    <option
                      key={l.leave_type}
                      value={l.leave_type}
                    >
                      {l.leave_type} ({l.leave_balance ?? 0})
                    </option>
                  ))}
                </select>
              </div>


              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  value={appStart}
                  onChange={(e) =>
                    setAppStart(e.target.value)
                  }
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-amber-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-amber-100
                  "
                />
              </div>


              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  value={appEnd}
                  onChange={(e) =>
                    setAppEnd(e.target.value)
                  }
                  className="
                    mt-2
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    focus:border-amber-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-amber-100
                  "
                />
              </div>


              {/* Days Requested */}
              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Days Requested
                </label>

                <div className="mt-2 flex items-center gap-3">

                  <input
                    type="number"
                    value={daysRequested}
                    readOnly
                    className="
                      min-w-0
                      flex-1
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-slate-900
                      outline-none
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setIsHalfDay((prev) => !prev)
                    }
                    className={`flex-none rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isHalfDay
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isHalfDay
                      ? "Half Day ✓"
                      : "Half Day"}
                  </button>

                </div>
              </div>


              {/* Approver */}
              <div className="sm:col-span-2">

                <label className="block text-sm font-semibold text-slate-700">
                  Approver Name
                </label>

                <textarea
                  disabled
                  value={approverName.join("\n")}
                  rows={2}
                  className="
                    mt-2
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    py-3
                    text-sm
                    text-slate-600
                    outline-none
                  "
                />

              </div>


              {/* Reason */}
              <div className="sm:col-span-2">

                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">
                    Reason
                  </label>

                  <span className="text-xs text-slate-400">
                    Required
                  </span>
                </div>

                <textarea
                  value={appReason}
                  onChange={(e) =>
                    setAppReason(e.target.value)
                  }
                  rows={4}
                  placeholder="Please provide a reason for your leave..."
                  className="
                    mt-2
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-amber-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-amber-100
                  "
                />

              </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================== */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => {
                  setIsApplying(false);
                  resetApplicationForm();
                }}
                disabled={isSubmitting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-slate-700
                  transition-all
                  hover:bg-slate-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-amber-600
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-amber-200
                  transition-all
                  hover:bg-amber-700
                  hover:shadow-md
                  focus:outline-none
                  focus:ring-2
                  focus:ring-amber-400
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>,
    document.body
  )}







      {/* {isApplying && !retrieveApproverLoading && (
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

                  <textarea
                    disabled
                    value={approverName.join("\n")}
                    rows={2}
                    className="resize-none mt-2 w-full rounded-lg px-3 py-2 text-sm outline-none themed-bg-card themed-text"
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
      )} */}

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
                      {a.id} - {a.leave_type} | {a.employee_id} - {formatName_FN_MI_LN(a.employee.firstname, a.employee.middlename, a.employee.lastname)}
                    </p>
                    <p className="font-semibold">
                      {formatDate_Month_Day_Year(a.start_date)} → {formatDate_Month_Day_Year(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
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
                    <div className="mt-2 flex text-sm">
                      <span className="text-sm text-slate-500">{a.id} - {a.leave_type} -</span> - (
                      {a.approver_id_status?.map((approver, index) => (
                        <span key={approver.id}>
                          {index > 0 && (
                            <span className="mx-1 text-slate-400">|</span>
                          )}
                          <span
                            className={`font-semibold ${
                              approver.status === "approved"
                                ? "text-emerald-600"
                                : approver.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {approver.status.charAt(0).toUpperCase() +
                              approver.status.slice(1)}
                          </span>
                        </span>
                      ))})
                    </div>
                    <p className="font-semibold">
                      {formatDate_Month_Day_Year(a.start_date)} → {formatDate_Month_Day_Year(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
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
                        <p className="text-sm text-slate-500">{a.id} - {a.leave_type}</p>

                        <p className="font-semibold">
                          {formatDate_Month_Day_Year(a.start_date)} → {formatDate_Month_Day_Year(a.end_date)} - ({a.days_requested} {a.days_requested === 1 ? "day" : "days"})
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
