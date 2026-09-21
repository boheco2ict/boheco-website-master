import { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import EmptyState from "../../reusable/EmptyState";
import { useEmployeeDirectory } from "../../../hooks/useEmployeeDirectory";
import { useAssignedMemos } from "../../../hooks/useAssignedMemos";
import AddMemoForm from "./AddMemoForm";
import AssignedMemosList from "./AssignedMemosList";

function MemoTab({ employee }) {
  const canISendMemo = employee.role === "HR";
  const [memoMode, setMemoMode] = useState("view");
  const [memoMessage, setMemoMessage] = useState("");

  const { allEmployee, getDepartmentName } = useEmployeeDirectory(employee);

  const {
    myAssignMemo,
    isMemoLoading,
    markingMemoId,
    currentPage,
    totalPages,
    currentMemos,
    handleMarkAsRead,
    handleOpenMemo,
    goToPrevious,
    goToNext,
  } = useAssignedMemos(employee);

  return (
    <div className="space-y-5">
      {canISendMemo && (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Memos</p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Employee Memo Management
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-600">
                Paste a Google Drive memo URL, then choose a
                specific employee or a batch to send.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMemoMessage("");
                setMemoMode("add");
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Add Memo
            </button>
          </div>
        </div>
      )}

      {memoMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {memoMessage}
        </div>
      )}

      {memoMode === "add" && !canISendMemo ? (
        <EmptyState
          icon={FaRegFileAlt}
          title="Access denied"
          message="Only HR can add Memos."
        />
      ) : memoMode === "add" ? (
        <AddMemoForm
          allEmployee={allEmployee}
          getDepartmentName={getDepartmentName}
          employeeId={employee.employee.id}
          onSent={() => setMemoMode("view")}
          onCancel={() => setMemoMode("view")}
          onClearMessage={() => setMemoMessage("")}
        />
      ) : (
        <AssignedMemosList
          memos={myAssignMemo}
          currentMemos={currentMemos}
          isLoading={isMemoLoading}
          markingMemoId={markingMemoId}
          currentPage={currentPage}
          totalPages={totalPages}
          onOpenMemo={handleOpenMemo}
          onMarkAsRead={handleMarkAsRead}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </div>
  );
}

export default MemoTab;
