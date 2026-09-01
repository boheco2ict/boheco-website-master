import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) {
  if (totalPages <= 1) return null;

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 px-1 pt-5">

      {/* Previous Button */}
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstPage}
        aria-label="Go to previous page"
        className="
          inline-flex
          h-9
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3.5
          text-sm
          font-medium
          text-slate-600
          shadow-sm
          transition-all
          duration-200
          hover:border-slate-300
          hover:bg-slate-50
          hover:text-slate-900
          active:scale-[0.98]
          focus:outline-none
          focus:ring-2
          focus:ring-slate-300
          focus:ring-offset-1
          disabled:cursor-not-allowed
          disabled:border-slate-100
          disabled:bg-slate-50
          disabled:text-slate-300
          disabled:shadow-none
        "
      >
        <FaChevronLeft className="text-[9px]" />
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>

      {/* Page Indicator */}
      <div
        className="
          flex
          h-9
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-slate-50
          px-3
          shadow-sm
        "
      >
        <span className="text-xs font-medium text-slate-500">
          Page
        </span>

        <span className="min-w-[24px] text-center text-sm font-semibold text-slate-800">
          {currentPage}
        </span>

        <span className="text-xs text-slate-400">
          /
        </span>

        <span className="min-w-[24px] text-center text-sm font-medium text-slate-500">
          {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isLastPage}
        aria-label="Go to next page"
        className="
          inline-flex
          h-9
          items-center
          gap-2
          rounded-lg
          border
          border-slate-200
          bg-white
          px-3.5
          text-sm
          font-medium
          text-slate-600
          shadow-sm
          transition-all
          duration-200
          hover:border-slate-300
          hover:bg-slate-50
          hover:text-slate-900
          active:scale-[0.98]
          focus:outline-none
          focus:ring-2
          focus:ring-slate-300
          focus:ring-offset-1
          disabled:cursor-not-allowed
          disabled:border-slate-100
          disabled:bg-slate-50
          disabled:text-slate-300
          disabled:shadow-none
        "
      >
        <span>Next</span>
        <FaChevronRight className="text-[9px]" />
      </button>

    </div>
  );
}