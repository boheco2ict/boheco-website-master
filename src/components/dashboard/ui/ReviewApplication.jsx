import { useEffect, useState } from "react";
import {
  useParams,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RejectApplicationReasonModal from "../../RejectApplicationReasonModal";
import {
  getLeaveApplicationById,
  getEmployeeByUserId,
} from "../../../services/getservices";
import {
  rejectApplication,
  approveApplication
} from "../../../services/updateservices";
import {
  formatDate_Month_Day_Year,
  formatName_FN_MI_LN
} from "../../../services/generalservices";

export default function ReviewApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loadingfetchE, setIsLoadingE] = useState(true);
  const [loadingfetchA, setIsLoadingA] = useState(true);
  const [processingReject, setIsProcessingReject] = useState(false);
  const [processingApproval, setIsProcessingApprove] = useState(false);
  const { user } = useAuth();
  // Fetch logged-in employee
  useEffect(() => {
    const fetchemployee = async () => {
      try {
        setIsLoadingE(true);
        const employeeData = await getEmployeeByUserId(user.id);
        setEmployee(employeeData);
      } catch (error) {
        console.error("Error fetching employee:", error);
      } finally {
        setIsLoadingE(false);
      }
    };
    if (user?.id) {
      fetchemployee();
    }
  }, [user?.id]);

  // Fetch leave application
useEffect(() => {
  const fetchApplication = async () => {
    try {
      setIsLoadingA(true);

      const leaveApplication = await getLeaveApplicationById(id);
      const currentUserId = employee?.id;

      const approverStatus = leaveApplication?.approver_id_status?.find(
        (approver) =>
          Number(approver.id) === Number(currentUserId)
      );

      // User is not an approver OR already processed the application
      if (
        !approverStatus ||
        approverStatus.status !== "pending"
      ) {
        alert("You already review this application. Redirecting to leave tab.");
        navigate("/dashboard?tab=leave", { replace: true });
        return;
      }

      setApplications(leaveApplication);

    } catch (error) {
      console.error("Error fetching application:", error);

      alert("Cannot find Application. Redirecting to leave tab.");

      navigate("/dashboard?tab=leave", { replace: true });
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
  useEffect(() => {
    if (
      !loadingfetchE &&
      !loadingfetchA &&
      employee &&
      applications &&
      !currentApprover
    ) {
      alert(
        "You are not authorized to review this leave application."
      );

      navigate("/dashboard?tab=leave", {
        replace: true,
      });
    }
  }, [
    loadingfetchE,
    loadingfetchA,
    employee,
    applications,
    currentApprover,
    navigate,
  ]);

  if (loadingfetchE || loadingfetchA) {
    return (
      <div>
        Loading...
      </div>
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
      const response = await approveApplication(applications, employee.id);
      if (response.success) {
        alert(response.message);
        navigate("/dashboard?tab=leave", { replace: true });
      } else {
        alert(response.response || "Failed to approve application.");
      }
    } catch (error) {
      console.error("Failed to approve application:", error);
    } finally {
      setIsProcessingApprove(false);
    }
  }

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
      const response = await rejectApplication(applications, reason, employee.id);
      if (response.success) {
      setRejectModalOpen(false);

      alert(response.message);

      navigate("/dashboard?tab=leave", {
        replace: true,
      });
    } else {
      alert(
        response.response || "Failed to reject application."
      );
    }
    } catch (error) {
      console.error("Failed to reject application:", error);
    } finally {
      setIsProcessingReject(false);
    }
  }

  const home = () => {
    navigate("/dashboard?tab=leave", {
      replace: true,
    });
  };

  return (
    <div
      className="min-h-screen px-4 pb-8 pt-20 sm:px-6 lg:px-10"
      style={{ background: "var(--section-bg)" }}
    >
      <div className="mx-auto max-w-4xl rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-2xl font-bold text-slate-900">
          Review Leave Application
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please review the leave application below.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-slate-500">Employee</p>

            <p className="font-semibold text-slate-900">
              {formatName_FN_MI_LN(applications.employee?.firstname, applications.employee?.middlename, applications.employee?.lastname)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Leave Type</p>

            <p className="font-semibold">
              {applications?.leave_type}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Start Date</p>

            <p className="font-semibold">
              {formatDate_Month_Day_Year(applications?.start_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">End Date</p>

            <p className="font-semibold">
              {formatDate_Month_Day_Year(applications?.end_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Days Requested
            </p>

            <p className="font-semibold">
              {applications?.days_requested}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                applications.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : applications.status === "Approved"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {applications?.status}
            </span>
          </div>

        </div>

        <div className="mt-8">

          <p className="text-sm text-slate-500">
            Leave Reason
          </p>

          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            {applications?.reason}
          </div>

        </div>

        <div className="mt-5 flex justify-end gap-2">
          {/* home */}
          <button
            type="button"
            onClick={home}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            View Application
          </button>
          {/* Approve */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={processingApproval}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {processingApproval
              ? "Processing..."
              : "Approve"}
          </button>

          {/* Reject Modal */}
          <RejectApplicationReasonModal
            isOpen={rejectModalOpen}
            loading={processingReject}
            onClose={() => {
              setRejectModalOpen(false);
            }}
            onConfirm={handleReject}
          />

          {/* Reject */}
          <button
            type="button"
            onClick={() => {openRejectModal()}}
            disabled={processingReject}
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {processingReject
              ? "Processing..."
              : "Reject"}
          </button>

        </div>
      </div>
    </div>
  );
}
