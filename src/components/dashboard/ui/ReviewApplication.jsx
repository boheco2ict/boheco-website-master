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
} from "../../../services/getservices.js";
import {
  rejectApplication,
  approveApplication
} from "../../../services/updateservices.js";

export default function ReviewApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingfetchE, setIsLoadingE] = useState(true);
  const [loadingfetchA, setIsLoadingA] = useState(true);
  const [processingReject, setIsProcessingReject] = useState(false);
  const [processingApproval, setIsProcessingApprove] = useState(false);
  const { user } = useAuth();
  const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
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

        const leaveApplication =
          await getLeaveApplicationById(id);

        setApplications(leaveApplication);
      } catch (error) {
        console.error(
          "Error fetching application:",
          error
        );
      } finally {
        setIsLoadingA(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);
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

  // ADMIN ONLY
  if (
    String(employee.role).toUpperCase() !== "ADMIN"
  ) {
    alert("You're not an admin. Redirecting to Dashboard...");

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  if (applications.status !== "pending") {
    alert("Application is not pending. Redirecting to Dashboard...");
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  const openRejectModal = () => {
    setRejectModalOpen(true);
  };
  const rejectApp = async (reason) => {
    const confirmed = window.confirm(
        "Are you sure you want to reject this leave application?"
      );
      if (!confirmed) return;
    try {
      setIsProcessingReject(true);

      const response = await rejectApplication(
        applications.id,
        reason
      );
      console.log("reject application response: ", response.id);
      setRejectModalOpen(false);
      alert("Leave Application Rejected Successfully. Redirecting to Dashboard...");
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "❌ Failed to reject application:",
        error
      );

      alert(
        error.message ||
          "Failed to reject leave application."
      );

    } finally {
      setIsProcessingReject(false);
    }
  };
  const approveApp = async () => {
    const confirmed = window.confirm(
        "Are you sure you want to approve this leave application?"
      );
      if (!confirmed) return;
    try {
      setIsProcessingApprove(true);
      const response = await approveApplication(applications);
      console.log("approve application response: ", response.application.id);
      console.log("balance application response: ", response.balance.id);
      alert("Leave Application Approve Successfully. Redirecting to Dashboard...");
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "❌ Failed to approve application:",
        error
      );

      alert(
        error.message ||
          "Failed to approve leave application."
      );

    } finally {
      setIsProcessingApprove(false);
    }
  }

const home = () => {
  navigate("/dashboard?tab=leave", {
    replace: true,
  });
};

  // console.log("application: ", applications);
  // console.log("employee: ", employee);
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
              {applications?.name}
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
              {formatDate(applications?.start_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">End Date</p>

            <p className="font-semibold">
              {formatDate(applications?.end_date)}
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
            onClick={approveApp}
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
            onConfirm={rejectApp}
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