import { useEffect, useState } from "react";
import {
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaCalendarAlt,
  FaClock,
  FaFileAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import { useAuth } from "../../../context/AuthContext";
import RejectApplicationReasonModal from "../../RejectApplicationReasonModal";

import {
  getLeaveApplicationById
} from "../../../services/getservices";

import {
  rejectApplication,
  approveApplication,
} from "../../../services/updateservices";

import {
  formatDate_Month_Day_Year,
  formatName_FN_MI_LN,
} from "../../../utils";

export default function ReviewApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loadingfetchA, setIsLoadingA] = useState(true);
  const [processingReject, setIsProcessingReject] = useState(false);
  const [processingApproval, setIsProcessingApprove] = useState(false);
  const { employeeInfo, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) {
      return;
    }
    setEmployee(employeeInfo);
  }, [employeeInfo, authLoading]);

  // Fetch leave application
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setIsLoadingA(true);
        const leaveApplication = await getLeaveApplicationById(id);
        const currentUserId = employee?.id;
        const approverStatus = leaveApplication?.approver_id_status?.find((approver) => Number(approver.id) === Number(currentUserId));

        if (approverStatus) {
          if (approverStatus.status !== "pending") {
            alert(
              "You already review this application. Redirecting to Leave Tab."
            );
            navigate("/dashboard?tab=leave", {
              replace: true,
            });
            return;
          }
          if (!approverStatus.id === currentUserId) {
            alert(
              "You are not the Approver of this Application. Redirecting to Leave Tab."
            );
            navigate("/dashboard?tab=leave", {
              replace: true,
            });
            return;
          }
        }
        setApplications(leaveApplication);
      } catch (error) {
        console.error("Error fetching application:", error);
        alert(
          "Cannot find Application. Redirecting to Leave Tab."
        );
        navigate("/dashboard?tab=leave", {
          replace: true,
        });
        return;
      } finally {
        setIsLoadingA(false);
      }
    };

    if (id && employee?.id) {
      fetchApplication();
    }
  }, [employee?.id, id, navigate]);

  const currentApprover =
    applications?.approver_id_status?.find(
      (approver) =>
        String(approver.id) === String(employee?.id) &&
        approver.status?.trim().toLowerCase() === "pending"
    );

  if (!employee || loadingfetchA) {
    return (
      <div></div>
    );
  }

  // Employee not found
  if (!employee) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!currentApprover) {
    return null;
  }

  const openRejectModal = () => {
    setRejectModalOpen(true);
  };

  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this leave application?"
    );

    if (!confirmed) return;

    try {
      setIsProcessingApprove(true);

      const response = await approveApplication(
        applications,
        employee.id
      );

      if (response.success) {
        alert(response.message);

        navigate("/dashboard?tab=leave", {
          replace: true,
        });
      } else {
        alert(
          response.response ||
            "Failed to approve application."
        );
      }
    } catch (error) {
      console.error(
        "Failed to approve application:",
        error
      );
    } finally {
      setIsProcessingApprove(false);
    }
  };

  const handleReject = async (reason) => {
    if (!reason) {
      console.error("No Reason Provided.");
      alert("No Reason Provided.");
      return;
    }

    if (!applications) {
      console.error("No Application Provided.");
      alert("No Application Provided.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to reject this leave application?"
    );

    if (!confirmed) return;

    try {
      setIsProcessingReject(true);

      const response = await rejectApplication(
        applications,
        reason,
        employee.id
      );

      if (response.success) {
        setRejectModalOpen(false);

        alert(response.message);

        navigate("/dashboard?tab=leave", {
          replace: true,
        });
      } else {
        alert(
          response.response ||
            "Failed to reject application."
        );
      }
    } catch (error) {
      console.error(
        "Failed to reject application:",
        error
      );
    } finally {
      setIsProcessingReject(false);
    }
  };

  const home = () => {
    navigate("/dashboard?tab=leave", {
      replace: true,
    });
  };

  const getStatusStyles = () => {
    const status =
      applications?.status?.trim().toLowerCase();

    if (status === "pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  return (
    <div
      className="w-full pl-5 pr-5 pt-[20px] pb-5 min-h-screen"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-600">
                  <FaFileAlt />
                  Leave Management
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Review Leave Application
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Review the employee's leave request before making
                  an approval decision.
                </p>
              </div>
            </div>
          </div>

          {/* Application Information */}
          <div className="px-6 py-7 sm:px-8">

            {/* Section Title */}
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <FaUser />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Application Details
                </h2>

                <p className="text-xs text-slate-500">
                  Information provided in the leave request
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Employee */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <FaUser />
                  Employee
                </div>

                <p className="text-base font-bold text-slate-900">
                  {formatName_FN_MI_LN(
                    applications.employee?.firstname,
                    applications.employee?.middlename,
                    applications.employee?.lastname
                  )}
                </p>
              </div>

              {/* Leave Type */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <FaFileAlt />
                  Leave Type
                </div>

                <p className="text-base font-bold text-slate-900">
                  {applications?.leave_type}
                </p>
              </div>

              {/* Days Requested */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <FaClock />
                  Days Requested
                </div>

                <p className="text-base font-bold text-slate-900">
                  {applications?.days_requested}
                </p>
              </div>

              {/* Start Date */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <FaCalendarAlt />
                  Start Date
                </div>

                <p className="text-base font-bold text-slate-900">
                  {formatDate_Month_Day_Year(
                    applications?.start_date
                  )}
                </p>
              </div>

              {/* End Date */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-slate-300">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <FaCalendarAlt />
                  End Date
                </div>

                <p className="text-base font-bold text-slate-900">
                  {formatDate_Month_Day_Year(
                    applications?.end_date
                  )}
                </p>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Application Status
                </div>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold ${getStatusStyles()}`}
                >
                  {applications?.status}
                </span>
              </div>
            </div>

            {/* Leave Reason */}
            <div className="mt-7">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <FaFileAlt />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Leave Reason
                  </h3>

                  <p className="text-xs text-slate-500">
                    Reason provided by the employee
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-700">
                  {applications?.reason ||
                    "No reason provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer / Actions */}
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

              <button
                type="button"
                onClick={home}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <FaArrowLeft className="text-xs" />
                View Application
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Reject */}
                <button
                  type="button"
                  onClick={() => {
                    openRejectModal();
                  }}
                  disabled={processingReject}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaTimes />

                  {processingReject
                    ? "Processing..."
                    : "Reject"}
                </button>

                {/* Approve */}
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={processingApproval}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaCheck />

                  {processingApproval
                    ? "Processing..."
                    : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectApplicationReasonModal
        isOpen={rejectModalOpen}
        loading={processingReject}
        onClose={() => {
          setRejectModalOpen(false);
        }}
        onConfirm={handleReject}
      />
    </div>
  );
}