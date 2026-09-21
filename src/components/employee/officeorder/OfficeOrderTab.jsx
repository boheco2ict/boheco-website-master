import { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import EmptyState from "../../reusable/EmptyState";
import OfficeOrderHeader from "./OfficeOrderHeader";
import OfficeOrderForm from "./OfficeOrderForm";
import OfficeOrderList from "./OfficeOrderList";
import useOfficeOrders from "../../../hooks/useOfficeOrders";
import useOfficeOrderForm from "../../../hooks/useOfficeOrderForm";

function OfficeOrderTab({employee}) {
  const canISendMemo = employee.role === "HR";
  const [officeOrderMode, setOfficeOrderMode] = useState("view");
  const [officeOrderMessage, setOfficeOrderMessage] = useState("");

  const {
    myAssignOfficeOrder,
    isOfficeOrderLoading,
    markingOfficeOrderId,
    currentPage,
    totalPages,
    currentMemos,
    handleOpenMemo,
    handleMarkAsRead,
    goToPreviousPage,
    goToNextPage,
  } = useOfficeOrders(employee, setOfficeOrderMessage);

  const {
    officeOrderName,
    setOfficeOrderName,
    officeOrderDescription,
    setOfficeOrderDescription,
    officeOrderUrl,
    setOfficeOrderUrl,
    recipientType,
    setRecipientType,
    individualTarget,
    setIndividualTarget,
    batchTarget,
    setBatchTarget,
    allEmployee,
    setBatchEmployeeIds,
    departmentFilter,
    setDepartmentFilter,
    submitLoading,
    getDepartmentName,
    resetMemoForm,
    handleSendMemo,
  } = useOfficeOrderForm(employee, setOfficeOrderMessage);

  return (
    <div className="space-y-5">
      {canISendMemo && (
        <OfficeOrderHeader
          onAddClick={() => {
            setOfficeOrderMessage("");
            setOfficeOrderMode("add");
          }}
        />
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
        <OfficeOrderForm
          officeOrderName={officeOrderName}
          setOfficeOrderName={setOfficeOrderName}
          officeOrderDescription={officeOrderDescription}
          setOfficeOrderDescription={setOfficeOrderDescription}
          officeOrderUrl={officeOrderUrl}
          setOfficeOrderUrl={setOfficeOrderUrl}
          recipientType={recipientType}
          setRecipientType={setRecipientType}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          individualTarget={individualTarget}
          setIndividualTarget={setIndividualTarget}
          batchTarget={batchTarget}
          setBatchTarget={setBatchTarget}
          allEmployee={allEmployee}
          setBatchEmployeeIds={setBatchEmployeeIds}
          getDepartmentName={getDepartmentName}
          submitLoading={submitLoading}
          onSubmit={(event) =>
            handleSendMemo(event, () => setOfficeOrderMode("view"))
          }
          onCancel={() => {
            resetMemoForm();
            setOfficeOrderMode("view");
          }}
        />
      ) : (
        <OfficeOrderList
          isLoading={isOfficeOrderLoading}
          allItemsCount={myAssignOfficeOrder?.length || 0}
          currentItems={currentMemos}
          markingOfficeOrderId={markingOfficeOrderId}
          onOpen={handleOpenMemo}
          onMarkAsRead={handleMarkAsRead}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={goToPreviousPage}
          onNext={goToNextPage}
        />
      )}
    </div>
  );
}

export default OfficeOrderTab;
