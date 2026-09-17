import { useCallback, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { supabase } from "../../services/supabase";
import { createLeaveApplication } from "../../services/postservices";
import { formatName_FN_MI_LN } from "../../utils/utils";
import { useLeaveApprovers } from "../../hooks/useLeaveApprovers";
import { useLeaveApplications } from "../../hooks/useLeaveApplications";
import LeaveBalancesGrid from "./leave/LeaveBalancesGrid";
import ApplyLeaveModal from "./leave/ApplyLeaveModal";
import AssignedApplicationsSection from "./leave/AssignedApplicationsSection";
import PendingApplicationsSection from "./leave/PendingApplicationsSection";
import LeaveHistorySection from "./leave/LeaveHistorySection";

function LeaveCreditsTab({ leaveCredits, employee: employeeInfo }) {
  const myID = employeeInfo.employee.id;
  const myDepartment = employeeInfo.employee.department;
  const myName = formatName_FN_MI_LN(
    employeeInfo.employee.firstname,
    employeeInfo.employee.middlename,
    employeeInfo.employee.lastname
  );

  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    approverId,
    approverName,
    approverEmail,
    loading: retrieveApproverLoading,
  } = useLeaveApprovers(myDepartment);

  const {
    pendingApplications,
    assignedApplications,
    historyApplications,
    processingApproval,
    processingReject,
    processingCancel,
    handleApprove,
    handleCancelApplication,
    handleReject,
  } = useLeaveApplications(myID);

  const handleOpenApply = () => {
    if (approverName.length === 0) {
      alert("No Leave Approver Assigned.");
      return;
    }
    setIsApplying(true);
  };

  const handleSubmitApplication = useCallback(
    async (formValues) => {
      if (!myID) {
        alert("Unable to determine employee record. Please reload.");
        return;
      }

      const approverIdStatus = approverId.map((id) => ({
        id,
        status: "pending",
      }));

      const payload = {
        employee_id: myID,
        ...formValues,
        status: "pending",
        approver_id_status: approverIdStatus,
        approved_at: null,
        created_at: new Date().toISOString(),
        cancelled_at: null,
      };

      try {
        setIsSubmitting(true);
        const response = await createLeaveApplication(payload);
        const { data: emailData, error: emailError } =
          await supabase.functions.invoke("send-leave-email", {
            body: {
              myDepartment,
              application: response,
              origin: window.location.origin,
              approverEmail,
              myName,
            },
          });

        if (response && emailData?.success) {
          alert("Leave Successfully Filed.");
        } else if (response && emailError) {
          alert(
            "Leave Successfully Filed, but the Email Notification Sent Error."
          );
        } else {
          alert("Failed to Submit Leave Application.");
        }
        setIsApplying(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [myID, approverId, myDepartment, approverEmail, myName]
  );

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)]">
        {/* Subtle accent */}
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          {/* Header */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-1 ring-amber-200/70">
              <FaCalendarAlt className="h-5 w-5" />
            </div>
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
          <button
            type="button"
            onClick={handleOpenApply}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-amber-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:w-auto"
          >
            <span>Apply for Leave</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </div>
      </div>

      {isApplying && !retrieveApproverLoading && (
        <ApplyLeaveModal
          leaveCredits={leaveCredits}
          approverName={approverName}
          isSubmitting={isSubmitting}
          onClose={() => setIsApplying(false)}
          onSubmit={handleSubmitApplication}
        />
      )}

      <LeaveBalancesGrid leaveCredits={leaveCredits} />

      <AssignedApplicationsSection
        applications={assignedApplications}
        processingApproval={processingApproval}
        processingReject={processingReject}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <PendingApplicationsSection
        applications={pendingApplications}
        processingCancel={processingCancel}
        onCancel={handleCancelApplication}
      />

      <LeaveHistorySection applications={historyApplications} />
    </div>
  );
}

export default LeaveCreditsTab;
