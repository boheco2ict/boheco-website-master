import { useState } from "react";
import RejectApplicationReasonModal from "../RejectApplicationReasonModal";
import Pagination from "../../reusable/Pagination";
import { usePagedList } from "../../../hooks/usePagedList";
import {
  formatName_FN_MI_LN,
  formatDate_Month_Day_Year,
} from "../../../utils/utils";

function AssignedApplicationsSection({
  applications,
  processingApproval,
  processingReject,
  onApprove,
  onReject,
}) {
  const { page, totalPages, paginated, goToPrevious, goToNext } =
    usePagedList(applications);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const openRejectModal = (application) => {
    setSelectedApplication(application);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelectedApplication(null);
  };

  const handleConfirmReject = async (reason) => {
    const success = await onReject(selectedApplication, reason);
    if (success) closeRejectModal();
  };

  if (applications.length === 0) return null;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm mb-4">
      <h3 className="text-lg font-semibold text-slate-900">
        Leave Applications - ({applications.length})
      </h3>
      <div className="mt-4 space-y-3">
        {paginated.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {a.id} - {a.leave_type} | {a.employee_id} -{" "}
                  {formatName_FN_MI_LN(
                    a.employee.firstname,
                    a.employee.middlename,
                    a.employee.lastname
                  )}
                </p>
                <p className="font-semibold">
                  {formatDate_Month_Day_Year(a.start_date)} →{" "}
                  {formatDate_Month_Day_Year(a.end_date)} - (
                  {a.days_requested} {a.days_requested === 1 ? "day" : "days"})
                </p>
                <p className="mt-1 text-sm italic text-slate-600">
                  Leave Reason: {a.reason}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(a)}
                  disabled={processingApproval === a.id}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {processingApproval === a.id ? "Processing..." : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => openRejectModal(a)}
                  disabled={processingReject === a.id}
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {processingReject === a.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rendered once for the whole section, not per row */}
      <RejectApplicationReasonModal
        isOpen={rejectModalOpen}
        loading={processingReject !== null}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </div>
  );
}

export default AssignedApplicationsSection;
