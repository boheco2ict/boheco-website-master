import { FaRegFileAlt } from "react-icons/fa";
import EmptyState from "../../reusable/EmptyState";
import Pagination from "../../reusable/Pagination";
import OfficeOrderItem from "./OfficeOrderItem";

function OfficeOrderList({
  isLoading,
  allItemsCount,
  currentItems,
  markingOfficeOrderId,
  onOpen,
  onMarkAsRead,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Assigned Office Order
          </h3>

          <p className="text-sm text-slate-600">
            View office order assigned to you here.
          </p>
        </div>

        {isLoading && (
          <span className="text-sm text-slate-500">
            Loading office order...
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      ) : allItemsCount > 0 ? (
        <div className="mt-6 space-y-4">
          {currentItems.map((item) => (
            <OfficeOrderItem
              key={item.id}
              item={item}
              isMarking={markingOfficeOrderId === item.id}
              onOpen={onOpen}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>
      ) : (
        <EmptyState
          icon={FaRegFileAlt}
          title="No office order assigned"
          message="Office Order sent to you will appear here."
        />
      )}
    </div>
  );
}

export default OfficeOrderList;
